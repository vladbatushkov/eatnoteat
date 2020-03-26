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
    , hp : HealthPoint
    , hero : Hero
    , food : List Food
    }


type alias BestResult =
    { name : String
    , score : Int
    }


type alias Widget =
    { onClick : Msg
    , state : Animation.Messenger.State Msg
    }


type alias HealthPoint =
    { value : Int
    , widget : Widget
    }


type alias Food =
    { id : Int
    , name : String
    , tags : List Tags
    , picture : String
    , widget : Widget
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
    | HealthPointObject


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
        defaultHealth
        arnold
        allFood
    , Cmd.none
    )



-- UPDATE


type Msg
    = Eat Int
    | Damage Int
    | ChangeHero
    | Shuffle (List Food)
    | FadeOutFadeIn Int
    | Disappear Int
    | Animate Int AnimatedObject Animation.Msg
    | DoNothing


applyAnimationToSingle : Widget -> (Animation.Messenger.State Msg -> Animation.Messenger.State Msg) -> Widget
applyAnimationToSingle widget fn =
    { widget | state = fn widget.state }


applyAnimationToAll : List Widget -> (Animation.Messenger.State Msg -> Animation.Messenger.State Msg) -> List Widget
applyAnimationToAll widgets fn =
    List.map (\x -> applyAnimationToSingle x fn) widgets


update : Msg -> Model -> ( Model, Cmd Msg )
update action model =
    case action of
        DoNothing ->
            ( model, Cmd.none )

        Damage points ->
            let
                hp =
                    model.hp.value - points

                gameState =
                    if hp == 0 then
                        GameOver

                    else
                        KeepPlaying
            in
            case gameState of
                GameOver ->
                    ( { model | hp = defaultHealth }, Cmd.none )

                KeepPlaying ->
                    ( { model | hp = HealthPoint hp wrapAnimationHealthPoint }, Cmd.none )

        Eat points ->
            let
                hero =
                    model.hero

                result =
                    selectBestResult model.bestResult (BestResult hero.name model.score)
            in
            ( { model | score = model.score + points, bestResult = result }, generate Shuffle (shuffle defaultFood model.food) )

        Shuffle randomFood ->
            ( { model | food = randomFood }, Cmd.none )

        ChangeHero ->
            let
                hero =
                    model.hero

                result =
                    selectBestResult model.bestResult (BestResult hero.name model.score)
            in
            ( { model | hero = nextHero model.hero, score = 0, hp = defaultHealth, bestResult = result }, generate Shuffle (shuffle defaultFood model.food) )

        FadeOutFadeIn i ->
            let
                tags =
                    case Array.get i <| Array.fromList <| List.map .tags allFood of
                        Just t ->
                            t

                        Nothing ->
                            []

                ( eatPoints, damagePoints ) =
                    calcEat model tags

                damageAnimation =
                    if damagePoints > 0 then
                        Disappear damagePoints

                    else
                        DoNothing
            in
            ( { model
                | food =
                    List.map
                        (\x ->
                            { x
                                | widget =
                                    applyAnimationToSingle x.widget <|
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
                            }
                        )
                        model.food
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
                        | widget =
                            applyAnimationToSingle hp.widget <|
                                Animation.interrupt
                                    [ Animation.to
                                        [ Animation.translate (px 100) (px 100)
                                        ]
                                    , Animation.Messenger.send <| Damage damagePoints
                                    ]
                    }
              }
            , Cmd.none
            )

        Animate i ao aMsg ->
            case ao of
                HealthPointObject ->
                    let
                        hp =
                            model.hp

                        ( stateHp, cmdHp ) =
                            Animation.Messenger.update aMsg hp.widget.state
                    in
                    ( { model
                        | hp =
                            { hp | widget = applyAnimationToSingle hp.widget (\_ -> stateHp) }
                      }
                    , cmdHp
                    )

                FoodObject ->
                    case Array.get i <| Array.fromList model.food of
                        Just f ->
                            let
                                widget =
                                    f.widget

                                ( stateFood, cmdFood ) =
                                    Animation.Messenger.update aMsg widget.state
                            in
                            ( { model
                                | food =
                                    List.map (\x -> { x | widget = applyAnimationToSingle x.widget (\_ -> stateFood) })
                                        model.food
                              }
                            , cmdFood
                            )

                        Nothing ->
                            ( model, Cmd.none )


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
        foodStates =
            List.map (\x -> { state = x.widget.state, i = x.id, ao = FoodObject }) <| List.map (\y -> { id = y.id, widget = y.widget }) model.food

        healthState =
            { state = model.hp.widget.state, i = -1, ao = HealthPointObject }

        all =
            healthState :: foodStates
    in
    Sub.batch (List.map (\z -> Animation.subscription (Animate z.i z.ao) [ z.state ]) all)



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
        []
        (List.take 5 (List.map card model.food))


card : Food -> Html Msg
card model =
    let
        widget =
            model.widget
    in
    column columnModifiers
        (Animation.render widget.state ++ [ style "cursor" "pointer", onClick widget.onClick ])
        [ image (OneByOne Unbounded)
            [ style "cursor" "pointer" ]
            [ img [ src model.picture, style "border-radius" "10px" ] []
            ]
        , div
            (List.append styleBold
                [ style "width" "100%"
                , style "position" "relative"
                , style "text-align" "center"
                , style "font-size" "220%"
                ]
            )
            [ text model.name
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
            (animatedHeart model.hp.widget :: List.repeat (model.hp.value - 1) (tileChild Auto [] [ heart ]))
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


animatedHeart : Widget -> Html Msg
animatedHeart widget =
    tileChild Auto
        []
        [ div
            (Animation.render widget.state)
            [ image (OneByOne X64)
                []
                [ img [ src "../images/hero/heart.png" ] []
                ]
            ]
        ]


heart : Html Msg
heart =
    div []
        [ image (OneByOne X64)
            []
            [ img [ src "../images/hero/heart.png" ] []
            ]
        ]



-- STYLE


styleTitle : List (Attribute msg)
styleTitle =
    [ style "font-family" "font", style "font-weight" "bold", style "font-size" "500%" ]


styleBold : List (Attribute msg)
styleBold =
    [ style "font-family" "font", style "font-weight" "bold" ]


styleNormal : List (Attribute msg)
styleNormal =
    [ style "font-family" "font" ]



-- DATA


wrapAnimationHealthPoint : Widget
wrapAnimationHealthPoint =
    { onClick = DoNothing
    , state =
        Animation.style
            [ Animation.opacity 1
            ]
    }


defaultHealth : HealthPoint
defaultHealth =
    HealthPoint 3 wrapAnimationHealthPoint


wrapAnimationFood : Int -> Widget
wrapAnimationFood i =
    { onClick = FadeOutFadeIn i
    , state =
        Animation.style
            [ Animation.opacity 1
            ]
    }


defaultFood : Food
defaultFood =
    Food 0
        "Popcorn"
        [ NotHealthy ]
        "../images/food/popcorn.png"
        (wrapAnimationFood 0)


allFood : List Food
allFood =
    [ defaultFood
    , Food 1
        "Happy Meal"
        [ FastFood, NotHealthy ]
        "../images/food/happymeal.png"
        (wrapAnimationFood 1)
    , Food 2
        "Pizza"
        [ NotHealthy ]
        "../images/food/pizza.png"
        (wrapAnimationFood 2)
    , Food 3
        "Tiramisu"
        [ Dessert, Sweets ]
        "../images/food/chocolatecake.png"
        (wrapAnimationFood 3)
    , Food 4
        "Salad"
        [ Healthy ]
        "../images/food/salad.png"
        (wrapAnimationFood 4)
    ]
