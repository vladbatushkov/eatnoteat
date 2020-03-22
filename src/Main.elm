module Main exposing (..)

import Animation exposing (px)
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


type alias Widget =
    { onHover : Msg
    , onClick : Msg
    , state : Animation.State
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
        0
        3
        arnold
        allFood
    , Cmd.none
    )



-- UPDATE


type Msg
    = Eat
    | ChangeHero
    | Shadow Int
    | FadeOutFadeIn Int
    | Animate Animation.Msg


onState : (Animation.State -> Animation.State) -> Food -> Food
onState stateFn food =
    let
        widget =
            food.widget
    in
    { food | widget = { widget | state = stateFn widget.state } }


onIndex : Int -> List a -> (a -> a) -> List a
onIndex i list fn =
    List.indexedMap
        (\j val ->
            if i == j then
                fn val

            else
                val
        )
        list


onWidgetState : Model -> Int -> (Animation.State -> Animation.State) -> Model
onWidgetState model index fn =
    { model
        | food =
            onIndex index model.food <|
                onState fn
    }


onWidgetsState : Model -> (Animation.State -> Animation.State) -> Model
onWidgetsState model fn =
    { model
        | food =
            List.map (onState fn) model.food
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update action model =
    case action of
        Eat ->
            ( { model | score = model.score + 1, hp = model.hp - 1 }, Cmd.none )

        ChangeHero ->
            ( { model | hero = nextHero model.hero, score = 0, hp = 3 }, Cmd.none )

        Shadow i ->
            ( onWidgetState model i <|
                Animation.interrupt
                    [ Animation.to
                        [ Animation.translate (px 10) (px 10)
                        , Animation.scale 1.5
                        ]
                    , Animation.to
                        [ Animation.translate (px 0) (px 0)
                        , Animation.scale 1
                        ]
                    ]
            , Cmd.none
            )

        FadeOutFadeIn _ ->
            update Eat <|
                onWidgetsState model <|
                    Animation.interrupt
                        [ Animation.to
                            [ Animation.opacity 0
                            ]
                        , Animation.to
                            [ Animation.opacity 1
                            ]
                        ]

        Animate time ->
            ( { model
                | food =
                    List.map (onState (Animation.update time))
                        model.food
              }
            , Cmd.none
            )


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
    Animation.subscription Animate <|
        List.map .state <|
            List.map .widget model.food



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
    let
        widget =
            model.widget
    in
    column columnModifiers
        (Animation.render widget.state ++ [ style "cursor" "pointer", onClick widget.onClick ])
        [ image (OneByOne Unbounded)
            (Animation.render widget.state ++ [ style "cursor" "pointer", onMouseEnter widget.onHover ])
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


wrapAnimation : Int -> Widget
wrapAnimation i =
    { onHover = Shadow i
    , onClick = FadeOutFadeIn i
    , state =
        Animation.style
            [ Animation.translate (px 0) (px 0)
            , Animation.opacity 1
            ]
    }


allFood : List Food
allFood =
    [ Food 0
        "Popcorn"
        [ NotHealthy ]
        "../images/food/popcorn.png"
        (wrapAnimation 0)
    , Food 1
        "Happy Meal"
        [ FastFood, NotHealthy ]
        "../images/food/happymeal.png"
        (wrapAnimation 1)
    , Food 2
        "Pizza"
        [ NotHealthy ]
        "../images/food/pizza.png"
        (wrapAnimation 2)
    , Food 3
        "Tiramisu"
        [ Dessert, Sweets ]
        "../images/food/chocolatecake.png"
        (wrapAnimation 3)
    , Food 4
        "Salad"
        [ Healthy ]
        "../images/food/salad.png"
        (wrapAnimation 4)
    ]
