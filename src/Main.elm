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
    , gameState : GameState
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
    { foods : List Food
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
    = SelectHero
    | Play


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
        "Eats only leftovers and junk. Never touches normal food."
        "images/hero/arnold.png"
        [ Junk ]
        [ Healthy
        , NotHealthy
        , Drinks
        , Desserts
        ]


chuck : Hero
chuck =
    Hero 2
        "Chuck Muffin"
        "Fan of organic food and healthy drinks. Avoid all unhealthy products, except desserts."
        "images/hero/chuck.png"
        [ Healthy, Drinks, Desserts ]
        [ Junk
        , NotHealthy
        ]


terry : Hero
terry =
    Hero 3
        "Terry Fatness"
        "Fast-food maniac and meat lover. Vomit on healthy food and desserts."
        "images/hero/terry.png"
        [ NotHealthy ]
        [ Junk
        , Healthy
        , Drinks
        , Desserts
        ]


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model
        arnold
        initFoodPanel
        initGameplay
        SelectHero
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
    = DoNothing
    | Eat (List Tags)
    | Damage Int
    | ChangeHero Hero
    | Shuffle (List Food)
    | HealthCheck Int
    | Animate AnimatedObject Animation.Msg
    | ShuffleFood
    | OpenModal
    | CloseModal


update : Msg -> Model -> ( Model, Cmd Msg )
update action model =
    case action of
        OpenModal ->
            ( { model | gameState = SelectHero }, Cmd.none )

        CloseModal ->
            ( { model | gameState = Play }, Cmd.none )

        DoNothing ->
            ( model, Cmd.none )

        Shuffle randomFoods ->
            let
                newFoodPanel =
                    FoodPanel randomFoods model.foodPanel.animationState
            in
            ( { model | foodPanel = newFoodPanel }, Cmd.none )

        ShuffleFood ->
            ( model, generate Shuffle <| shuffle model.foodPanel.foods )

        HealthCheck points ->
            let
                healthLeft =
                    model.gameplay.hp.value - points

                gameState =
                    if healthLeft == 0 then
                        SelectHero

                    else
                        Play
            in
            case gameState of
                SelectHero ->
                    let
                        newBestResult =
                            selectBestResult model.gameplay.bestResults (BestResult model.hero.id model.gameplay.score)

                        newGameplay =
                            Gameplay 0 initHealth newBestResult
                    in
                    ( { model | hero = nextHero model.hero, gameplay = newGameplay, gameState = gameState }, Cmd.none )

                Play ->
                    let
                        newHealth =
                            Health healthLeft
                                (Animation.style
                                    [ Animation.opacity 1
                                    , Animation.translate (px 0) (px 0)
                                    ]
                                )

                        newGameplay =
                            Gameplay model.gameplay.score newHealth model.gameplay.bestResults
                    in
                    ( { model | gameplay = newGameplay, gameState = gameState }, Cmd.none )

        Eat tags ->
            let
                ( points, damage ) =
                    calcEat model tags

                nextMsg =
                    if damage > 0 then
                        Damage damage

                    else
                        DoNothing

                newFoodState =
                    Animation.queue
                        [ Animation.to
                            [ Animation.opacity 0
                            ]
                        , Animation.Messenger.send ShuffleFood
                        , Animation.Messenger.send nextMsg
                        , Animation.to
                            [ Animation.opacity 1
                            ]
                        ]
                        model.foodPanel.animationState

                newFoodPanel =
                    FoodPanel model.foodPanel.foods newFoodState

                newScore =
                    model.gameplay.score + points

                newGameplay =
                    Gameplay newScore model.gameplay.hp model.gameplay.bestResults
            in
            ( { model | gameplay = newGameplay, foodPanel = newFoodPanel }, Cmd.none )

        ChangeHero hero ->
            ( { model | hero = hero, gameState = Play }, Cmd.none )

        Damage points ->
            let
                newHpState =
                    Animation.queue
                        [ Animation.to
                            [ Animation.translate (px 0) (px 100)
                            , Animation.opacity 0
                            ]
                        , Animation.Messenger.send <| HealthCheck points
                        ]
                        model.gameplay.hp.animationState

                newHp =
                    Health model.gameplay.hp.value newHpState

                newGameplay =
                    Gameplay model.gameplay.score newHp model.gameplay.bestResults
            in
            ( { model | gameplay = newGameplay }, Cmd.none )

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
                            FoodPanel model.foodPanel.foods stateFood
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
    in
    Sub.batch (List.map (\x -> Animation.subscription (Animate x.ao) [ x.state ]) [ healthState, foodState ])



-- VIEW


view : Model -> Document Msg
view model =
    Document
        (cmsName
            ++ " - tasty Elm game to kill your free time © created by Vlad Batushkov"
        )
        [ main_ [ style "background-color" "#bebebe" ]
            [ stylesheet
            , font
            , body model
            , imagesPreload model
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
            , heroPanel model
            ]
        , gameModal model
        ]


gameModal : Model -> Html Msg
gameModal model =
    let
        isVisible =
            model.gameState == SelectHero
    in
    modal isVisible
        []
        [ modalBackground [ style "background-color" "#bebebe" ] []
        , modalContent [] <| heroList model
        , modalClose Large [ onClick CloseModal ] []
        ]


heroList : Model -> List (Html Msg)
heroList model =
    List.map
        (\x ->
            card [ class "mt-3", style "margin-top" "1.5rem" ]
                [ cardContent []
                    [ media [ onClick <| ChangeHero x ]
                        [ mediaLeft [ style "width" "40%" ]
                            [ image (OneByOne Unbounded)
                                []
                                [ img [ src x.picture, class "is-rounded" ] []
                                ]
                            , bestScore x.id model.gameplay SelectHero
                            ]
                        , mediaContent []
                            [ title H1 [] [ text x.name ]
                            , subtitle H2 [] [ text x.desc ]
                            ]
                        ]
                    ]
                ]
        )
        [ arnold, chuck, terry ]


foodGrid : Model -> Html Msg
foodGrid model =
    let
        foods =
            Array.fromList <| List.take 4 model.foodPanel.foods

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
            box [ style "cursor" "pointer", onClick (Eat food.tags) ]
                [ image (OneByOne Unbounded)
                    [ style "cursor" "pointer" ]
                    [ img [ src food.picture, style "border-radius" "10px" ] []
                    ]
                , title H2
                    [ class "has-text-centered" ]
                    [ text food.name
                    ]
                ]


heroPanel : Model -> Html Msg
heroPanel model =
    card []
        [ cardContent []
            [ media []
                [ mediaLeft [ style "width" "40%" ]
                    [ image (OneByOne Unbounded)
                        []
                        [ img [ src model.hero.picture, class "is-rounded" ] []
                        ]
                    , bestScore model.hero.id model.gameplay Play
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
    circle "white" "75px" "150px" <| span [ style "font-size" "4.5rem" ] [ text <| String.fromInt model.gameplay.score ]


bestScore : Int -> Gameplay -> GameState -> Html Msg
bestScore heroId gameplay gameState =
    let
        bottom =
            case gameState of
                Play ->
                    "150px"

                SelectHero ->
                    case heroId of
                        1 ->
                            "50px"

                        _ ->
                            "100px"
    in
    circle "gold" "0px" bottom <| span [ style "font-size" "4.5rem" ] [ bestResultText heroId gameplay.bestResults ]


circle : String -> String -> String -> Html Msg -> Html Msg
circle color side bottom child =
    div
        [ style "border-radius" "50%"
        , style "background-color" color
        , style "position" "absolute"
        , style "width" "100px"
        , style "height" "100px"
        , style "text-align" "center"
        , style "vertical-align" "middle"
        , style "bottom" bottom
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
            [ column columnModifiers ([ class "is-4", style "opacity" "1" ] ++ Animation.render hp.animationState) [ heart ]
            , column columnModifiers [ class "is-8" ] []
            ]

        2 ->
            [ column columnModifiers [ class "is-4" ] [ heart ]
            , column columnModifiers ([ class "is-4", style "opacity" "1" ] ++ Animation.render hp.animationState) [ heart ]
            , column columnModifiers [ class "is-4" ] []
            ]

        3 ->
            [ column columnModifiers [ class "is-4" ] [ heart ]
            , column columnModifiers [ class "is-4" ] [ heart ]
            , column columnModifiers ([ class "is-4", style "opacity" "1" ] ++ Animation.render hp.animationState) [ heart ]
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


imagesPreload : Model -> Html Msg
imagesPreload model =
    let
        foodImages =
            List.map .picture model.foodPanel.foods

        heroImages =
            [ arnold.picture, chuck.picture, terry.picture ]

        allImages =
            foodImages ++ heroImages
    in
    div [] (List.map (\x -> img [ src x, style "width" "0px", style "height" "0px" ] []) allImages)



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
    | Desserts


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
        [ Desserts ]
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
        [ Desserts ]
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
        [ Desserts ]
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
        [ Desserts ]
        "images/food/strawberrycake.png"
    , Food 34
        "Shake"
        [ Drinks ]
        "images/food/shake.png"
    , Food 35
        "Pepper"
        [ Healthy ]
        "images/food/redhotchilipepper.png"
    , Food 36
        "Sausages"
        [ NotHealthy ]
        "images/food/sausages.png"
    ]
