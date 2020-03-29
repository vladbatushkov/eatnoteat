module Main exposing (..)

import Animation exposing (px)
import Animation.Messenger
import Array exposing (..)
import Browser exposing (..)
import Bulma.CDN exposing (..)
import Bulma.Columns exposing (..)
import Bulma.Elements exposing (..)
import Bulma.Layout exposing (..)
import Bulma.Modifiers exposing (..)
import Bulma.Modifiers.Typography exposing (textCentered)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Random exposing (..)


extractValueHelper : List a -> Int -> List a -> Maybe ( a, List a )
extractValueHelper values index accumulator =
    case ( index, values ) of
        ( _, [] ) ->
            Nothing

        ( 0, head :: tail ) ->
            Just <| ( head, List.append (List.reverse accumulator) tail )

        ( _, head :: tail ) ->
            extractValueHelper tail (index - 1) <| head :: accumulator


extractValue : List a -> Int -> Maybe ( a, List a )
extractValue values index =
    extractValueHelper values index []


shuffle : a -> List a -> Generator (List a)
shuffle defaultA values =
    case values of
        [] ->
            Random.map (\_ -> []) (Random.weighted ( 80, True ) [ ( 20, False ) ])

        vals ->
            let
                randomIndexGenerator =
                    Random.int 0 <| List.length vals - 1

                extractAndRecurse =
                    \index ->
                        let
                            ( randomHead, remainder ) =
                                case extractValue vals index of
                                    Nothing ->
                                        ( defaultA, [] )

                                    Just a ->
                                        a

                            remainderGen =
                                shuffle defaultA remainder
                        in
                        Random.map (\randomTail -> randomHead :: randomTail) remainderGen
            in
            randomIndexGenerator
                |> Random.andThen extractAndRecurse



-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { bestResult : Maybe BestResult
    , score : Int
    , hp : Health
    , hero : Hero
    , food : List Food
    , foodState : Animation.Messenger.State Msg
    }


type alias BestResult =
    { name : String
    , score : Int
    }


type alias Health =
    { value : Int
    , state : Animation.Messenger.State Msg
    }


type alias Food =
    { id : Int
    , name : String
    , tags : List Tags
    , picture : String
    }


type alias Hero =
    { id : Int
    , name : String
    , desc : String
    , picture : String
    , goodTags : List Tags
    , badTags : List Tags
    }


type Tags
    = Healthy
    | NotHealthy
    | Meat
    | Dairy
    | Eggs
    | Junk
    | Dessert
    | Sweets
    | FastFood
    | Fruits


type GameState
    = KeepPlaying
    | GameOver


type AnimatedObject
    = FoodObject
    | HealthObject


arnold : Hero
arnold =
    Hero 1 "Arnold" "Eat all the trash and junk. Never touch normal food." "../images/hero/arnold.png" [ Junk ] [ Healthy ]


terry : Hero
terry =
    Hero 2 "Terry" "Fast-food and unheathly food lover. Vomit for desserts." "../images/hero/terry.png" [ Meat, FastFood, NotHealthy ] [ Dessert, Sweets ]


chuck : Hero
chuck =
    Hero 3 "Chuck" "Eat plant-based foods and dairy products, but not eggs." "../images/hero/chuck.png" [ Healthy, Dairy, Fruits ] [ Meat, FastFood, Eggs ]


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model
        Nothing
        0
        (initHealth 3)
        arnold
        allFood
        (Animation.style
            [ Animation.opacity 1
            ]
        )
    , Cmd.none
    )


initHealth : Int -> Health
initHealth hp =
    Health hp
        (Animation.style
            [ Animation.opacity 1
            , Animation.translate (px 0) (px 0)
            ]
        )



-- UPDATE


type Msg
    = Eat Int
    | Damage Int
    | ChangeHero
    | Shuffle (List Food)
    | FadeOutFadeIn (List Tags)
    | Disappear Int
    | Animate AnimatedObject Animation.Msg
    | DoNothing


applyAnimationToSingle : Animation.Messenger.State Msg -> (Animation.Messenger.State Msg -> Animation.Messenger.State Msg) -> Animation.Messenger.State Msg
applyAnimationToSingle state fn =
    fn state


applyAnimationToAll : List (Animation.Messenger.State Msg) -> (Animation.Messenger.State Msg -> Animation.Messenger.State Msg) -> List (Animation.Messenger.State Msg)
applyAnimationToAll states fn =
    List.map fn states


update : Msg -> Model -> ( Model, Cmd Msg )
update action model =
    case action of
        DoNothing ->
            ( model, Cmd.none )

        Damage points ->
            let
                healthLeft =
                    model.hp.value - points

                gameState =
                    if healthLeft == 0 then
                        GameOver

                    else
                        KeepPlaying

                result =
                    selectBestResult model.bestResult (BestResult model.hero.name model.score)

            in
            case gameState of
                GameOver ->
                    update ChangeHero { model | bestResult = result }

                KeepPlaying ->
                    ( { model | hp = initHealth healthLeft }, Cmd.none )

        Eat points ->
            ( { model | score = model.score + points }, generate Shuffle (shuffle defaultFood model.food) )

        Shuffle randomFoods ->
            ( { model | food = randomFoods }, Cmd.none )

        ChangeHero ->
            let
                hero =
                    model.hero

                result =
                    selectBestResult model.bestResult (BestResult hero.name model.score)
            in
            ( { model | hero = nextHero model.hero, score = 0, hp = initHealth 3, bestResult = result }, generate Shuffle (shuffle defaultFood model.food) )

        FadeOutFadeIn tags ->
            let
                ( eatPoints, damagePoints ) =
                    calcEat model tags

                damageAnimation =
                    if damagePoints > 0 then
                        Disappear damagePoints

                    else
                        DoNothing
            in
            ( { model
                | foodState =
                    Animation.queue
                        [ Animation.to
                            [ Animation.opacity 0
                            ]
                        , Animation.Messenger.send <| Eat eatPoints
                        , Animation.Messenger.send damageAnimation
                        , Animation.to
                            [ Animation.opacity 1
                            ]
                        ]
                        model.foodState
              }
            , Cmd.none
            )

        Disappear damagePoints ->
            let
                hp =
                    model.hp
            in
            ( { model
                | hp =
                    { hp
                        | state =
                            applyAnimationToSingle model.hp.state <|
                                Animation.interrupt
                                    [ Animation.to
                                        [ Animation.translate (px 0) (px 100)
                                        , Animation.opacity 0
                                        ]
                                    , Animation.Messenger.send <| Damage damagePoints
                                    ]
                    }
              }
            , Cmd.none
            )

        Animate aObject aMsg ->
            case aObject of
                HealthObject ->
                    let
                        hp =
                            model.hp

                        ( stateHp, cmdHp ) =
                            Animation.Messenger.update aMsg hp.state
                    in
                    ( { model
                        | hp =
                            { hp | state = stateHp }
                      }
                    , cmdHp
                    )

                FoodObject ->
                    let
                        ( stateFood, cmdFood ) =
                            Animation.Messenger.update aMsg model.foodState
                    in
                    ( { model
                        | foodState = stateFood
                      }
                    , cmdFood
                    )


selectBestResult : Maybe BestResult -> BestResult -> Maybe BestResult
selectBestResult current next =
    case current of
        Just br ->
            if br.score > next.score then
                Just br

            else
                Just next

        Nothing ->
            if next.score == 0 then
                Nothing

            else
                Just next


calcEat : Model -> List Tags -> ( Int, Int )
calcEat model tags =
    let
        points =
            List.length <| List.filter (\a -> List.any (\b -> b == a) tags) model.hero.goodTags

        damage =
            if List.isEmpty <| List.filter (\a -> List.any (\b -> b == a) tags) model.hero.badTags then
                0

            else
                1
    in
    ( points, damage )


nextHero : Hero -> Hero
nextHero hero =
    case hero.id of
        1 ->
            terry

        2 ->
            chuck

        _ ->
            arnold



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        foodState =
            { state = model.foodState, ao = FoodObject }

        healthState =
            { state = model.hp.state, ao = HealthObject }

        all =
            [ healthState, foodState ]
    in
    Sub.batch (List.map (\z -> Animation.subscription (Animate z.ao) [ z.state ]) all)



-- VIEW


view : Model -> Html Msg
view model =
    main_ []
        [ stylesheet
        , body model
        ]


body : Model -> Html Msg
body model =
    hero { heroModifiers | size = Large, color = Light, bold = True }
        []
        [ heroBody []
            [ container []
                [ score model
                , deck model
                , panel model
                ]
            ]
        ]


score : Model -> Html Msg
score model =
    container [ textCentered ]
        [ Bulma.Elements.title H1
            (List.append styleTitle [ style "margin-bottom" "10px" ])
            [ text "Chew Paper Box"
            ]
        , Bulma.Elements.title H2
            (List.append styleNormal [ style "margin-bottom" "20px" ])
            [ text ("Score: " ++ String.fromInt model.score)
            ]
        , bestResult model.bestResult
        ]


bestResult : Maybe BestResult -> Html Msg
bestResult result =
    case result of
        Nothing ->
            Bulma.Elements.title H3
                (List.append styleNormal [ style "margin-bottom" "10px" ])
                [ text "No results yet"
                ]

        Just br ->
            Bulma.Elements.title H3
                (List.append styleNormal [ style "margin-bottom" "10px" ])
                [ text ("Best result made with " ++ br.name ++ ": " ++ String.fromInt br.score)
                ]


deck : Model -> Html Msg
deck model =
    columns { columnsModifiers | gap = Gap3 }
        (Animation.render model.foodState)
        (List.take 5 (List.map card model.food))


card : Food -> Html Msg
card food =
    column columnModifiers
        [ style "cursor" "pointer", onClick (FadeOutFadeIn food.tags) ]
        [ image (OneByOne Unbounded)
            [ style "cursor" "pointer" ]
            [ img [ src food.picture, style "border-radius" "10px" ] []
            ]
        , div
            (List.append styleBold
                [ style "width" "100%"
                , style "position" "relative"
                , style "text-align" "center"
                , style "font-size" "220%"
                ]
            )
            [ text food.name
            ]
        ]


panel : Model -> Html Msg
panel model =
    tileAncestor Auto
        []
        [ tileParent Width2
            []
            [ tileChild Auto
                [ style "text-align" "center" ]
                [ profile model.hero
                , Bulma.Elements.button { buttonModifiers | outlined = True, size = Small, color = Primary }
                    [ onClick ChangeHero ]
                    [ text "Change Hero" ]
                ]
            ]
        , tileParent Width3
            []
            (healthContainer model)
        ]


profile : Hero -> Html Msg
profile model =
    div [ style "text-align" "-webkit-center" ]
        [ image (OneByOne X128)
            []
            [ img [ src model.picture, class "is-rounded" ] []
            ]
        , div
            (List.append styleBold
                [ style "font-size" "250%"
                ]
            )
            [ text model.name ]
        , span
            (List.append styleNormal
                [ style "font-size" "180%"
                ]
            )
            [ text model.desc ]
        ]


healthContainer : Model -> List (Html Msg)
healthContainer model =
    case model.hp.value of
        1 ->
            [ tileChild Auto (Animation.render model.hp.state) [ heart ], tileChild Auto [] [], tileChild Auto [] [] ]

        2 ->
            [ tileChild Auto [] [ heart ], tileChild Auto (Animation.render model.hp.state) [ heart ], tileChild Auto [] [] ]

        3 ->
            [ tileChild Auto [] [ heart ], tileChild Auto [] [ heart ],tileChild Auto (Animation.render model.hp.state) [ heart ] ]

        _ ->
            []


heart : Html Msg
heart =
    div []
        [ image (OneByOne X64)
            []
            [ img [ src "../images/hero/heart.png" ] []
            ]
        ]



-- STYLE


styleTitle : List (Attribute Msg)
styleTitle =
    [ style "font-family" "font", style "font-weight" "bold", style "font-size" "500%" ]


styleBold : List (Attribute Msg)
styleBold =
    [ style "font-family" "font", style "font-weight" "bold" ]


styleNormal : List (Attribute Msg)
styleNormal =
    [ style "font-family" "font" ]



-- DATA


defaultFood : Food
defaultFood =
    Food 0
        "Popcorn"
        [ NotHealthy ]
        "../images/food/popcorn.png"


allFood : List Food
allFood =
    [ defaultFood
    , Food 1
        "Happy Meal"
        [ FastFood, NotHealthy ]
        "../images/food/happymeal.png"
    , Food 2
        "Pizza"
        [ NotHealthy ]
        "../images/food/pizza.png"
    , Food 3
        "Tiramisu"
        [ Dessert, Sweets ]
        "../images/food/chocolatecake.png"
    , Food 4
        "Salad"
        [ Healthy ]
        "../images/food/salad.png"
    ]
