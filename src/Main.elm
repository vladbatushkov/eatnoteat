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
import Html exposing (Html, div, img, main_, span, text)
import Html.Attributes exposing (class, href, src, style)
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
    { screen : Screen
    , hero : Hero
    , foodPanel : FoodPanel
    , hp : Hp
    , score : Int
    , bestResults : List BestResult
    }


type Screen
    = SelectHeroScreen
    | PlayScreen


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


type alias Food =
    { id : Int
    , name : String
    , tags : List Tags
    , picture : String
    }


type alias Hp =
    { value : Int
    , animationState : AnimationState
    }


type alias AnimationState =
    Animation.Messenger.State Msg


type alias BestResult =
    { heroId : Int
    , score : Int
    }


type AnimatedObject
    = FoodObject
    | HpObject



-- CONSTR


arnold : Hero
arnold =
    Hero 1
        "Arnold Trash"
        "Eats only leftovers and junk. Never touches normal food."
        "images/hero/arnold.png"
        [ Junk ]
        [ Hpy
        , NotHpy
        , Drinks
        , Desserts
        ]


chuck : Hero
chuck =
    Hero 2
        "Chuck Muffin"
        "Fan of organic food and healthy drinks. Avoid unhealthy products, except desserts."
        "images/hero/chuck.png"
        [ Hpy, Drinks, Desserts ]
        [ Junk
        , NotHpy
        ]


terry : Hero
terry =
    Hero 3
        "Terry Fatness"
        "Fast-food maniac and meat lover. Vomit on healthy food and desserts."
        "images/hero/terry.png"
        [ NotHpy ]
        [ Junk
        , Hpy
        , Drinks
        , Desserts
        ]


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model
        SelectHeroScreen
        arnold
        initFoodPanel
        initHp
        0
        [ BestResult 1 0, BestResult 2 0, BestResult 3 0 ]
    , generate Shuffle <| shuffle allFood
    )


initFoodPanel : FoodPanel
initFoodPanel =
    FoodPanel allFood
        (Animation.style
            [ Animation.opacity 1
            ]
        )


initHp : Hp
initHp =
    Hp 3
        (Animation.style
            [ Animation.opacity 1
            , Animation.translate (px 0) (px 0)
            ]
        )



-- UPDATE


type Msg
    = Idle
    | Eat (List Tags)
    | Damage Int
    | HpCheck Int
    | ChangeHero Hero
    | ShuffleFood
    | Shuffle (List Food)
    | Animate AnimatedObject Animation.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update action model =
    case action of
        Idle ->
            ( model, Cmd.none )

        Eat tags ->
            let
                ( points, damage ) =
                    calcEat model tags

                nextMsg =
                    if damage > 0 then
                        Damage damage

                    else
                        Idle

                newAnimationState =
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

                foodPanel =
                    model.foodPanel

                newFoodPanel =
                    { foodPanel | animationState = newAnimationState }

                newScore =
                    model.score + points
            in
            ( { model | score = newScore, foodPanel = newFoodPanel }, Cmd.none )

        Damage points ->
            let
                newHpState =
                    Animation.queue
                        [ Animation.to
                            [ Animation.translate (px 0) (px 100)
                            , Animation.opacity 0
                            ]
                        , Animation.Messenger.send <| HpCheck points
                        ]
                        model.hp.animationState

                newHp =
                    Hp model.hp.value newHpState
            in
            ( { model | hp = newHp }, Cmd.none )

        HpCheck points ->
            let
                hpLeft =
                    model.hp.value - points

                newScreen =
                    if hpLeft == 0 then
                        SelectHeroScreen

                    else
                        PlayScreen
            in
            case newScreen of
                SelectHeroScreen ->
                    let
                        newBestResults =
                            selectBestResults model.bestResults (BestResult model.hero.id model.score)
                    in
                    ( { model | bestResults = newBestResults, screen = newScreen }, Cmd.none )

                PlayScreen ->
                    let
                        newHp =
                            Hp hpLeft
                                (Animation.style
                                    [ Animation.opacity 1
                                    , Animation.translate (px 0) (px 0)
                                    ]
                                )
                    in
                    ( { model | hp = newHp, screen = newScreen }, Cmd.none )

        ChangeHero hero ->
            ( { model | hero = hero, screen = PlayScreen }, Cmd.none )

        ShuffleFood ->
            ( model, generate Shuffle <| shuffle model.foodPanel.foods )

        Shuffle randomFoods ->
            let
                foodPanel =
                    model.foodPanel

                newFoodPanel =
                    { foodPanel | foods = randomFoods }
            in
            ( { model | foodPanel = newFoodPanel }, Cmd.none )

        Animate aObj aMsg ->
            case aObj of
                HpObject ->
                    let
                        ( stateHp, cmdHp ) =
                            Animation.Messenger.update aMsg model.hp.animationState

                        hp =
                            model.hp

                        newHp =
                            { hp | animationState = stateHp }
                    in
                    ( { model | hp = newHp }, cmdHp )

                FoodObject ->
                    let
                        ( stateFood, cmdFood ) =
                            Animation.Messenger.update aMsg model.foodPanel.animationState

                        foodPanel =
                            model.foodPanel

                        newFoodPanel =
                            { foodPanel | animationState = stateFood }
                    in
                    ( { model | foodPanel = newFoodPanel }, cmdFood )


selectBestResults : List BestResult -> BestResult -> List BestResult
selectBestResults bestResults newResult =
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



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        foodState =
            { state = model.foodPanel.animationState, ao = FoodObject }

        hpState =
            { state = model.hp.animationState, ao = HpObject }
    in
    Sub.batch (List.map (\x -> Animation.subscription (Animate x.ao) [ x.state ]) [ hpState, foodState ])



-- VIEW


view : Model -> Document Msg
view model =
    Document
        "EatNotEat - tasty Elm game to kill your free time © created by Vlad Batushkov"
        [ main_ [ style "background-color" "#fff" ]
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
            [ span [ style "font-size" "5rem" ] [ text "EatNotEat" ]
            , foodGrid model
            , heroPanel model
            ]
        , gameModal model
        ]


gameModal : Model -> Html Msg
gameModal model =
    let
        isVisible =
            model.screen == SelectHeroScreen
    in
    modal isVisible
        []
        [ modalBackground [ style "background-color" "#fff" ] []
        , modalContent [ style "width" "90%" ] <|
            [ div [ class "has-text-centered" ]
                (span [ style "font-size" "5rem" ] [ text "EatNotEat" ]
                    :: heroList model
                )
            ]
        ]


heroList : Model -> List (Html Msg)
heroList model =
    List.map
        (\x ->
            card [ style "margin-top" "1.5rem" ]
                [ cardContent []
                    [ media [ onClick <| ChangeHero x ]
                        [ mediaLeft [ style "width" "40%" ]
                            [ image (OneByOne Unbounded)
                                []
                                [ img [ src x.picture, class "is-rounded" ] []
                                ]
                            , bestScore x.id model.bestResults SelectHeroScreen
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
    card [ class "mt-3", style "margin-top" "1.5rem" ]
        [ cardContent []
            [ media []
                [ mediaLeft [ style "width" "40%" ]
                    [ image (OneByOne Unbounded)
                        []
                        [ img [ src model.hero.picture, class "is-rounded" ] []
                        ]
                    , bestScore model.hero.id model.bestResults PlayScreen
                    , currentScore model
                    ]
                , mediaContent []
                    [ title H1 [] [ text model.hero.name ]
                    , subtitle H2 [] [ text model.hero.desc ]
                    ]
                ]
            , hpPanel model.hp
            ]
        ]


currentScore : Model -> Html Msg
currentScore model =
    circle "white" "75px" "150px" <| span [ style "font-size" "4.5rem" ] [ text <| String.fromInt model.score ]


bestScore : Int -> List BestResult -> Screen -> Html Msg
bestScore heroId bestResults screen =
    let
        bottom =
            case screen of
                PlayScreen ->
                    "150px"

                SelectHeroScreen ->
                    "25px"
    in
    circle "gold" "0px" bottom <| span [ style "font-size" "4.5rem" ] [ bestResultText heroId bestResults ]


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


hpPanel : Hp -> Html Msg
hpPanel model =
    columns { columnsModifiers | centered = True, display = MobileAndBeyond }
        [ style "text-align" "-webkit-center" ]
    <|
        hpContainer model


hpContainer : Hp -> List (Html Msg)
hpContainer hp =
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



-- DATA


type Tags
    = Hpy
    | NotHpy
    | Junk
    | Drinks
    | Desserts


allFood : List Food
allFood =
    [ Food 0
        "Popcorn"
        [ NotHpy ]
        "images/food/popcorn.png"
    , Food 1
        "Happy Meal"
        [ NotHpy ]
        "images/food/happymeal.png"
    , Food 2
        "Pizza"
        [ NotHpy ]
        "images/food/pizza.png"
    , Food 3
        "Tiramisu"
        [ Desserts ]
        "images/food/tiramisu.png"
    , Food 4
        "Salad"
        [ Hpy ]
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
        [ Hpy ]
        "images/food/bread.png"
    , Food 8
        "Burgers"
        [ NotHpy ]
        "images/food/burgers.png"
    , Food 9
        "Carrot"
        [ Hpy ]
        "images/food/carrot.png"
    , Food 10
        "Sode Water"
        [ Drinks ]
        "images/food/cola.png"
    , Food 11
        "Cheese"
        [ Hpy ]
        "images/food/cheese.png"
    , Food 12
        "Creamy"
        [ Desserts ]
        "images/food/creamy.png"
    , Food 13
        "Cucumber"
        [ Hpy ]
        "images/food/cucumber.png"
    , Food 14
        "Eggs"
        [ Hpy ]
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
        [ NotHpy ]
        "images/food/kfc.png"
    , Food 18
        "Leftovers"
        [ Junk ]
        "images/food/leftovers.png"
    , Food 19
        "Lemon"
        [ Hpy ]
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
        [ NotHpy ]
        "images/food/pepperoni.png"
    , Food 23
        "Plastic Box"
        [ Junk ]
        "images/food/plasticbox.png"
    , Food 24
        "Meat Ribs"
        [ NotHpy ]
        "images/food/ribs.png"
    , Food 25
        "Salmon"
        [ Hpy ]
        "images/food/salmon.png"
    , Food 26
        "Sausage Plate"
        [ NotHpy ]
        "images/food/sausageplate.png"
    , Food 27
        "Shawarma"
        [ NotHpy ]
        "images/food/shawarma.png"
    , Food 28
        "Steak"
        [ NotHpy ]
        "images/food/steak.png"
    , Food 29
        "Steak Plate"
        [ NotHpy ]
        "images/food/steakplate.png"
    , Food 30
        "Tacos"
        [ NotHpy ]
        "images/food/tacos.png"
    , Food 31
        "Tomatos"
        [ Hpy ]
        "images/food/tomatos.png"
    , Food 32
        "Wok"
        [ NotHpy ]
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
        [ Hpy ]
        "images/food/redhotchilipepper.png"
    , Food 36
        "Sausages"
        [ NotHpy ]
        "images/food/sausages.png"
    ]
