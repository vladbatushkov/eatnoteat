module Main exposing (..)

import Animation exposing (px)
import Animation.Messenger
import Array exposing (..)
import Browser exposing (..)
import Bulma.CDN exposing (..)
import Bulma.Columns exposing (..)
import Bulma.Components exposing (..)
import Bulma.Elements exposing (..)
import Bulma.Layout exposing (..)
import Bulma.Modifiers exposing (..)
import Bulma.Modifiers.Typography exposing (textCentered)
import Html exposing (Attribute, Html, a, div, img, main_, span, text)
import Html.Attributes exposing (class, href, src, style, target, width)
import Html.Events exposing (..)
import Random exposing (generate)
import Random.List exposing (shuffle)



-- MAIN


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { hero : Hero
    , foodPanel : FoodPanel
    , gameplay : Gameplay
    }


type alias Hero =
    { id : Int
    , name : String
    , desc : String
    , picture : String
    , goodTags : List Tags
    , badTags : List Tags
    }


type alias FoodPanel =
    { food : List Food
    , animationState : AnimationState
    }


type alias AnimationState =
    Animation.Messenger.State Msg


type alias Gameplay =
    { score : Int
    , hp : Health
    , bestResults : List BestResult
    }


type alias BestResult =
    { heroId : Int
    , score : Int
    }


type alias Health =
    { value : Int
    , animationState : AnimationState
    }


type alias Food =
    { id : Int
    , name : String
    , tags : List Tags
    , picture : String
    }


type GameState
    = KeepPlaying
    | GameOver


type AnimatedObject
    = FoodObject
    | HealthObject



-- CONSTR


cmsName : String
cmsName =
    "EatNotEat"


arnold : Hero
arnold =
    Hero 1
        "Arnold Trash"
        "Eats any leftovers and junk. Drinks all the fluids. Never touches normal food."
        "images/hero/arnold.png"
        [ Junk, Drinks ]
        [ Healthy
        , NotHealthy
        ]


chuck : Hero
chuck =
    Hero 2
        "Chuck Muffin"
        "Eats plant-based foods and liquid products. Avoiding any unhealthy food."
        "images/hero/chuck.png"
        [ Healthy, Drinks ]
        [ Junk
        , NotHealthy
        ]


terry : Hero
terry =
    Hero 3
        "Terry Fatness"
        "Loves fast-food and heavy meals. Vomit on desserts and healthy food."
        "images/hero/terry.png"
        [ NotHealthy ]
        [ Junk
        , Healthy
        , Drinks
        ]


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model
        arnold
        initFoodPanel
        initGameplay
    , generate Shuffle <| shuffle allFood
    )


initFoodPanel : FoodPanel
initFoodPanel =
    FoodPanel allFood
        (Animation.style
            [ Animation.opacity 1
            ]
        )


initGameplay : Gameplay
initGameplay =
    Gameplay 0 initHealth [ BestResult 1 0, BestResult 2 0, BestResult 3 0 ]


initHealth : Health
initHealth =
    Health 3
        (Animation.style
            [ Animation.opacity 1
            , Animation.translate (px 0) (px 0)
            ]
        )



-- UPDATE


type Msg
    = Eat Int Int
    | Damage Int
      --| ChangeHero
    | Shuffle (List Food)
    | FadeOutFadeIn (List Tags)
    | Disappear Int
    | Animate AnimatedObject Animation.Msg
    | ShuffleFood


update : Msg -> Model -> ( Model, Cmd Msg )
update action model =
    case action of
        ShuffleFood ->
            ( model, generate Shuffle <| shuffle model.foodPanel.food )

        Damage points ->
            -- GAMEOVER: save bestReult, nextHero, trigger Shuffle OR KEEPPLAYING: dec. hp, trigger Shuffle
            let
                healthLeft =
                    model.gameplay.hp.value - points

                gameState =
                    if healthLeft == 0 then
                        GameOver

                    else
                        KeepPlaying
            in
            case gameState of
                GameOver ->
                    let
                        newBestResult =
                            selectBestResult model.gameplay.bestResults (BestResult model.hero.id model.gameplay.score)

                        newGameplay =
                            Gameplay 0 initHealth newBestResult
                    in
                    update ShuffleFood { model | hero = nextHero model.hero, gameplay = newGameplay }

                -- show modal
                KeepPlaying ->
                    let
                        newHealth =
                            Health healthLeft model.gameplay.hp.animationState

                        newGameplay =
                            Gameplay model.gameplay.score newHealth model.gameplay.bestResults
                    in
                    update ShuffleFood { model | gameplay = newGameplay }

        Eat points damagePoints ->
            -- gives new score, trigger Disappear OR ShuffleFood
            let
                damageMsg =
                    if damagePoints > 0 then
                        Disappear damagePoints

                    else
                        ShuffleFood

                newScore =
                    model.gameplay.score + points

                newGameplay =
                    Gameplay newScore model.gameplay.hp model.gameplay.bestResults
            in
            update damageMsg { model | gameplay = newGameplay }

        Shuffle randomFoods ->
            let
                newFoodState =
                    Animation.queue
                        [ --Animation.to
                          --[ Animation.opacity 0
                          --]
                          --, Animation.Messenger.send <| Eat eatPoints
                          --, Animation.Messenger.send damageAnimation
                          Animation.to
                            [ Animation.opacity 1
                            ]
                        ]
                        model.foodPanel.animationState

                newFoodPanel =
                    FoodPanel randomFoods newFoodState
            in
            ( { model | foodPanel = newFoodPanel }, Cmd.none )

        --ChangeHero ->
        --  let
        --    newGameplay =
        --      Gameplay 0 initHealth model.gameplay.bestResults
        --in
        -- ( { model | hero = nextHero model.hero, gameplay = newGameplay }, generate Shuffle <| shuffle model.foodPanel.food )
        FadeOutFadeIn tags ->
            -- animate food, trigger Eat
            let
                ( eatPoints, damagePoints ) =
                    calcEat model tags

                -- damageAnimation =
                --   if damagePoints > 0 then
                --     Disappear damagePoints
                --else
                --  DoNothing
                newFoodState =
                    Animation.queue
                        [ Animation.to
                            [ Animation.opacity 0
                            ]

                        --, Animation.Messenger.send <| Eat eatPoints
                        --, Animation.Messenger.send damageAnimation
                        --, Animation.to
                        --  [ Animation.opacity 1
                        -- ]
                        ]
                        model.foodPanel.animationState

                newFoodPanel =
                    FoodPanel model.foodPanel.food newFoodState
            in
            update (Eat eatPoints damagePoints) { model | foodPanel = newFoodPanel }

        Disappear damagePoints ->
            -- animate heart, trigger Damage
            let
                newHpState =
                    Animation.queue
                        [ Animation.to
                            [ Animation.translate (px 0) (px 100)
                            , Animation.opacity 0
                            ]

                        --, Animation.Messenger.send <| Damage damagePoints
                        ]
                        model.gameplay.hp.animationState

                newHp =
                    Health model.gameplay.hp.value newHpState

                newGameplay =
                    Gameplay model.gameplay.score newHp model.gameplay.bestResults
            in
            update (Damage damagePoints) { model | gameplay = newGameplay }

        Animate aObject aMsg ->
            case aObject of
                HealthObject ->
                    let
                        ( stateHp, cmdHp ) =
                            Animation.Messenger.update aMsg model.gameplay.hp.animationState

                        newHp =
                            Health model.gameplay.hp.value stateHp

                        newGameplay =
                            Gameplay model.gameplay.score newHp model.gameplay.bestResults
                    in
                    ( { model | gameplay = newGameplay }, cmdHp )

                FoodObject ->
                    let
                        ( stateFood, cmdFood ) =
                            Animation.Messenger.update aMsg model.foodPanel.animationState

                        newFoodPanel =
                            FoodPanel model.foodPanel.food stateFood
                    in
                    ( { model | foodPanel = newFoodPanel }, cmdFood )


selectBestResult : List BestResult -> BestResult -> List BestResult
selectBestResult bestResults newResult =
    List.map (\x -> mapBestResult x newResult) bestResults


mapBestResult : BestResult -> BestResult -> BestResult
mapBestResult a b =
    if a.heroId == b.heroId then
        if a.score > b.score then
            a

        else
            b

    else
        a


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
            chuck

        2 ->
            terry

        _ ->
            arnold



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        foodState =
            { state = model.foodPanel.animationState, ao = FoodObject }

        healthState =
            { state = model.gameplay.hp.animationState, ao = HealthObject }

        all =
            [ healthState, foodState ]
    in
    Sub.batch (List.map (\x -> Animation.subscription (Animate x.ao) [ x.state ]) all)



-- VIEW


view : Model -> Document Msg
view model =
    Document
        (cmsName
            ++ " - tasty Elm game to kill your free time © created by Vlad Batushkov"
        )
        [ main_ []
            [ stylesheet
            , font
            , body model
            ]
        ]


font : Html msg
font =
    Html.node "link"
        [ Html.Attributes.rel "stylesheet"
        , href "https://fonts.googleapis.com/css2?family=Grandstander:wght@300;500&display=swap"
        ]
        []


body : Model -> Html Msg
body model =
    section NotSpaced
        [ style "padding" "1rem", style "font-family" "Grandstander" ]
        [ container [ class "has-text-centered" ]
            [ span [ style "font-size" "5rem" ] [ text cmsName ]
            , foodGrid model
            , playPanel model
            ]
        ]


foodGrid : Model -> Html Msg
foodGrid model =
    let
        foods =
            Array.fromList <| List.take 4 model.foodPanel.food

        food1 =
            Array.get 0 foods

        food2 =
            Array.get 1 foods

        food3 =
            Array.get 2 foods

        food4 =
            Array.get 3 foods
    in
    div (Animation.render model.foodPanel.animationState)
        [ foodPair food1 food2
        , foodPair food3 food4
        ]


foodPair : Maybe Food -> Maybe Food -> Html Msg
foodPair food1 food2 =
    columns { columnsModifiers | centered = True, display = MobileAndBeyond, gap = Gap2 }
        []
        [ column columnModifiers
            [ class "is-6", textCentered ]
            [ foodCard food1
            ]
        , column columnModifiers
            [ class "is-6", textCentered ]
            [ foodCard food2
            ]
        ]


foodCard : Maybe Food -> Html Msg
foodCard maybeFood =
    case maybeFood of
        Nothing ->
            text ""

        Just food ->
            box [ style "cursor" "pointer", onClick (FadeOutFadeIn food.tags) ]
                [ image (OneByOne Unbounded)
                    [ style "cursor" "pointer" ]
                    [ img [ src food.picture, style "border-radius" "10px" ] []
                    ]
                , title H2
                    [ class "has-text-centered" ]
                    [ text food.name
                    ]
                ]


playPanel : Model -> Html Msg
playPanel model =
    card [ class "mt-3", style "margin-top" "1.5rem" ]
        [ cardContent []
            [ media []
                [ mediaLeft [ style "width" "40%" ]
                    [ image (OneByOne Unbounded)
                        []
                        [ img [ src model.hero.picture, class "is-rounded" ] []
                        ]
                    , bestScore model
                    , currentScore model
                    ]
                , mediaContent []
                    [ title H1 [] [ text model.hero.name ]
                    , subtitle H2 [] [ text model.hero.desc ]
                    ]
                ]
            , healthPanel model.gameplay.hp

            --, button { buttonModifiers | outlined = True, size = Large, color = Primary }
            --  [ onClick ChangeHero ]
            --[ text "Change Hero" ]
            ]
        ]


currentScore : Model -> Html Msg
currentScore model =
    circle "white" "75px" <| span [ style "font-size" "4.5rem" ] [ text <| String.fromInt model.gameplay.score ]


bestScore : Model -> Html Msg
bestScore model =
    circle "gold" "0px" <| span [ style "font-size" "4.5rem" ] [ bestResultText model.hero.id model.gameplay.bestResults ]


circle : String -> String -> Html Msg -> Html Msg
circle color side child =
    div
        [ style "border-radius" "50%"
        , style "background-color" color
        , style "position" "absolute"
        , style "width" "100px"
        , style "height" "100px"
        , style "text-align" "center"
        , style "vertical-align" "middle"
        , style "bottom" "150px"
        , style "left" side
        ]
        [ child ]


bestResultText : Int -> List BestResult -> Html Msg
bestResultText heroId brs =
    let
        bestResults =
            List.filter (\x -> x.heroId == heroId) brs

        br =
            Array.get 0 <| Array.fromList bestResults
    in
    case br of
        Nothing ->
            text ""

        Just val ->
            text <| String.fromInt val.score


healthPanel : Health -> Html Msg
healthPanel model =
    columns { columnsModifiers | centered = True, display = MobileAndBeyond }
        [ style "text-align" "-webkit-center" ]
    <|
        healthContainer model


healthContainer : Health -> List (Html Msg)
healthContainer hp =
    case hp.value of
        1 ->
            [ column columnModifiers ([ class "is-4" ] ++ Animation.render hp.animationState) [ heart ]
            ]

        2 ->
            [ column columnModifiers [ class "is-4" ] [ heart ]
            , column columnModifiers ([ class "is-4" ] ++ Animation.render hp.animationState) [ heart ]
            ]

        3 ->
            [ column columnModifiers [ class "is-4" ] [ heart ]
            , column columnModifiers [ class "is-4" ] [ heart ]
            , column columnModifiers (Animation.render hp.animationState) [ heart ]
            ]

        _ ->
            []


heart : Html Msg
heart =
    div []
        [ image (OneByOne X128)
            []
            [ img [ src "images/hero/heart.png" ] []
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


type Tags
    = Healthy
    | NotHealthy
    | Junk
    | Drinks


allFood : List Food
allFood =
    [ Food 0
        "Popcorn"
        [ NotHealthy ]
        "images/food/popcorn.png"
    , Food 1
        "Happy Meal"
        [ NotHealthy ]
        "images/food/happymeal.png"
    , Food 2
        "Pizza"
        [ NotHealthy ]
        "images/food/pizza.png"
    , Food 3
        "Tiramisu"
        [ NotHealthy ]
        "images/food/tiramisu.png"
    , Food 4
        "Salad"
        [ Healthy ]
        "images/food/salad.png"
    , Food 5
        "Apple Stump"
        [ Junk ]
        "images/food/applestump.png"
    , Food 6
        "Empty Bottle"
        [ Junk ]
        "images/food/bottle.png"
    , Food 7
        "Bread"
        [ Healthy ]
        "images/food/bread.png"
    , Food 8
        "Burgers"
        [ NotHealthy ]
        "images/food/burgers.png"
    , Food 9
        "Carrot"
        [ Healthy ]
        "images/food/carrot.png"
    , Food 10
        "Sode Water"
        [ Drinks ]
        "images/food/cola.png"
    , Food 11
        "Cheese"
        [ Healthy ]
        "images/food/cheese.png"
    , Food 12
        "Creamy"
        [ NotHealthy ]
        "images/food/creamy.png"
    , Food 13
        "Cucumber"
        [ Healthy ]
        "images/food/cucumber.png"
    , Food 14
        "Eggs"
        [ Healthy ]
        "images/food/eggs.png"
    , Food 15
        "Fallen Ice Cream"
        [ Junk ]
        "images/food/icecream.png"
    , Food 16
        "Jar"
        [ Junk ]
        "images/food/jar.png"
    , Food 17
        "Chicken Drumsticks"
        [ NotHealthy ]
        "images/food/kfc.png"
    , Food 18
        "Leftovers"
        [ Junk ]
        "images/food/leftovers.png"
    , Food 19
        "Lemon"
        [ Healthy ]
        "images/food/lemon.png"
    , Food 20
        "Milk"
        [ Drinks ]
        "images/food/milk.png"
    , Food 21
        "Fruity Cake"
        [ NotHealthy ]
        "images/food/orangecake.png"
    , Food 22
        "Pepperoni"
        [ NotHealthy ]
        "images/food/pepperoni.png"
    , Food 23
        "Plastic Box"
        [ Junk ]
        "images/food/plasticbox.png"
    , Food 24
        "Meat Ribs"
        [ NotHealthy ]
        "images/food/ribs.png"
    , Food 25
        "Salmon"
        [ Healthy ]
        "images/food/salmon.png"
    , Food 26
        "Sausage Plate"
        [ NotHealthy ]
        "images/food/sausageplate.png"
    , Food 27
        "Shawarma"
        [ NotHealthy ]
        "images/food/shawarma.png"
    , Food 28
        "Steak"
        [ NotHealthy ]
        "images/food/steak.png"
    , Food 29
        "Steak Plate"
        [ NotHealthy ]
        "images/food/steakplate.png"
    , Food 30
        "Tacos"
        [ NotHealthy ]
        "images/food/tacos.png"
    , Food 31
        "Tomatos"
        [ Healthy ]
        "images/food/tomatos.png"
    , Food 32
        "Wok"
        [ NotHealthy ]
        "images/food/wok.png"
    , Food 33
        "Strawberry Cake"
        [ NotHealthy ]
        "images/food/strawberrycake.png"
    , Food 34
        "Shake"
        [ Drinks ]
        "images/food/shake.png"
    , Food 35
        "Pepper"
        [ NotHealthy ]
        "images/food/redhotchilipepper.png"
    , Food 36
        "Sausages"
        [ NotHealthy ]
        "images/food/sausages.png"
    ]
