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


main : Program Int Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { device : Device
    , screen : Screen
    , hero : Hero
    , foodPanel : FoodPanel
    , hp : Hp
    , score : Int
    , bestResults : List BestResult
    }


type alias Device =
    { deviceType : DeviceType
    , scoreBottom : String
    , scoreSize : String
    , scoreFont : String
    , heroImageWidth : String
    , heartImageSize : ImageSize
    }


type DeviceType
    = Phone
    | Desktop


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


init : Int -> ( Model, Cmd Msg )
init size =
    ( Model
        (detectDevice size)
        SelectHeroScreen
        arnold
        initFoodPanel
        initHp
        0
        [ BestResult 1 0, BestResult 2 0, BestResult 3 0 ]
    , generate Shuffle <| shuffle allFood
    )


detectDevice : Int -> Device
detectDevice size =
    if size > 768 then
        Device Desktop "50px" "50px" "2.25rem" "130px" X64

    else
        Device Phone "75px" "100px" "4rem" "250px" X128


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
                    ( { model | hp = initHp, score = 0, bestResults = newBestResults, screen = newScreen }, Cmd.none )

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


view : Model -> Html Msg
view model =
    main_ [ style "background-color" "#fff" ]
        [ stylesheet
        , font
        , body model
        , imagesPreload model
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
                        [ mediaLeft [ style "width" model.device.heroImageWidth ]
                            [ image (OneByOne Unbounded)
                                []
                                [ img [ src x.picture, class "is-rounded" ] []
                                ]
                            , score x.id model.bestResults model
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
    in
    div (Animation.render model.foodPanel.animationState)
        (case model.device.deviceType of
            Phone ->
                [ foodPair foods 0 1
                , foodPair foods 2 3
                ]

            Desktop ->
                [ foodRow foods
                ]
        )


foodRow : Array Food -> Html Msg
foodRow foods =
    columns { columnsModifiers | centered = True, display = MobileAndBeyond, gap = Gap2 }
        []
        [ column columnModifiers
            [ class "is-3", textCentered ]
            [ foodCard <| Array.get 0 foods
            ]
        , column columnModifiers
            [ class "is-3", textCentered ]
            [ foodCard <| Array.get 1 foods
            ]
        , column columnModifiers
            [ class "is-3", textCentered ]
            [ foodCard <| Array.get 2 foods
            ]
        , column columnModifiers
            [ class "is-3", textCentered ]
            [ foodCard <| Array.get 3 foods
            ]
        ]


foodPair : Array Food -> Int -> Int -> Html Msg
foodPair foods i j =
    columns { columnsModifiers | centered = True, display = MobileAndBeyond, gap = Gap2 }
        []
        [ column columnModifiers
            [ class "is-6", textCentered ]
            [ foodCard <| Array.get i foods
            ]
        , column columnModifiers
            [ class "is-6", textCentered ]
            [ foodCard <| Array.get j foods
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
                , title H3
                    [ class "has-text-centered" ]
                    [ text food.name
                    ]
                ]


heroPanel : Model -> Html Msg
heroPanel model =
    card [ class "mt-3", style "margin-top" "1.5rem" ]
        [ cardContent []
            [ media []
                [ mediaLeft
                    [ style "width" model.device.heroImageWidth
                    ]
                    [ image (OneByOne Unbounded)
                        []
                        [ img [ src model.hero.picture, class "is-rounded" ] []
                        ]
                    , score model.hero.id [ BestResult model.hero.id model.score ] model
                    ]
                , mediaContent []
                    [ title H1 [] [ text model.hero.name ]
                    , subtitle H2 [] [ text model.hero.desc ]
                    ]
                ]
            , hpPanel model
            ]
        ]


score : Int -> List BestResult -> Model -> Html Msg
score heroId results model =
    circle "gold" model.device <| span [ style "font-size" model.device.scoreFont ] [ resultText heroId results ]


circle : String -> Device -> Html Msg -> Html Msg
circle color ds child =
    div
        [ style "border-radius" "50%"
        , style "background-color" color
        , style "position" "relative"
        , style "width" ds.scoreSize
        , style "height" ds.scoreSize
        , style "text-align" "center"
        , style "vertical-align" "middle"
        , style "bottom" ds.scoreBottom
        , style "left" ""
        ]
        [ child ]


resultText : Int -> List BestResult -> Html Msg
resultText heroId brs =
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


hpPanel : Model -> Html Msg
hpPanel model =
    columns { columnsModifiers | centered = True, display = MobileAndBeyond }
        [ style "text-align" "-webkit-center" ]
    <|
        hpContainer model


hpContainer : Model -> List (Html Msg)
hpContainer model =
    case model.hp.value of
        1 ->
            [ column columnModifiers ([ class "is-4", style "opacity" "1" ] ++ Animation.render model.hp.animationState) [ heart model.device.heartImageSize ]
            , column columnModifiers [ class "is-8" ] []
            ]

        2 ->
            [ column columnModifiers [ class "is-4" ] [ heart model.device.heartImageSize ]
            , column columnModifiers ([ class "is-4", style "opacity" "1" ] ++ Animation.render model.hp.animationState) [ heart model.device.heartImageSize ]
            , column columnModifiers [ class "is-4" ] []
            ]

        3 ->
            [ column columnModifiers [ class "is-4" ] [ heart model.device.heartImageSize ]
            , column columnModifiers [ class "is-4" ] [ heart model.device.heartImageSize ]
            , column columnModifiers ([ class "is-4", style "opacity" "1" ] ++ Animation.render model.hp.animationState) [ heart model.device.heartImageSize ]
            ]

        _ ->
            []


heart : ImageSize -> Html Msg
heart size =
    div []
        [ image (OneByOne size)
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
