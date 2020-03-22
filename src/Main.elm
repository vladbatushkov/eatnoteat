module Main exposing (..)

import Browser
import Bulma.CDN exposing (..)
import Bulma.Columns exposing (..)
import Bulma.Elements exposing (..)
import Bulma.Layout exposing (..)
import Bulma.Modifiers exposing (..)
import Bulma.Modifiers.Typography exposing (textCentered)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)



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
    { score : Int
    , hp : Int -- health points
    , hero : Hero
    , food : List Food
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
    ( Model 0 3 arnold food, Cmd.none )



-- UPDATE


type Msg
    = Eat
    | ChangeHero


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Eat ->
            ( { model | score = model.score + 1, hp = model.hp - 1 }, Cmd.none )

        ChangeHero ->
            ( { model | hero = nextHero model.hero, score = 0, hp = 3 }, Cmd.none )


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
subscriptions _ =
    Sub.none



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


score : Model -> Html msg
score model =
    container [ textCentered ]
        [ Bulma.Elements.title H1
            (List.append styleTitle [ style "margin-bottom" "10px" ])
            [ text "Chew Paper Box"
            ]
        , Bulma.Elements.title H2
            (List.append styleNormal [ style "margin-bottom" "50px" ])
            [ text ("Score: " ++ String.fromInt model.score)
            ]
        ]


deck : Model -> Html Msg
deck model =
    columns { columnsModifiers | gap = Gap3 }
        []
        (List.take 5 (List.map card model.food))


card : Food -> Html Msg
card model =
    column columnModifiers
        []
        [ image (OneByOne Unbounded)
            [ onClick Eat, style "cursor" "pointer" ]
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
            (List.repeat model.hp (tileChild Auto [] [ heart ]))
        ]


toHeart : Html Msg
toHeart =
    tileChild Auto [] [ heart ]


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


heart : Html Msg
heart =
    image (OneByOne X64)
        []
        [ img [ src "../images/hero/heart.png" ] []
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


food : List Food
food =
    [ Food 1 "Popcorn" [ NotHealthy ] "../images/food/popcorn.png"
    , Food 2 "Happy Meal" [ FastFood, NotHealthy ] "../images/food/happymeal.png"
    , Food 3 "Pizza" [ NotHealthy ] "../images/food/pizza.png"
    , Food 4 "Tiramisu" [ Dessert, Sweets ] "../images/food/chocolatecake.png"
    , Food 5 "Salad" [ Healthy ] "../images/food/salad.png"
    ]
