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
    }


type alias Hero =
    { id : Int
    , name : String
    , desc : String
    , picture : String
    }


arnold : Hero
arnold =
    Hero 1 "Arnold" "Eat all the trash and junk. Never touch normal food." "../images/hero/arnold.png"


terry : Hero
terry =
    Hero 2 "Terry" "Fast-food maniac. Meat lover. Vomit for desserts." "../images/hero/terry.png"


chuck : Hero
chuck =
    Hero 3 "Chuck" "Eat plant-based foods and dairy products." "../images/hero/chuck.png"


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model 0 3 arnold, Cmd.none )



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
                , deck
                , panel model
                ]
            ]
        ]


score : Model -> Html msg
score model =
    container [ textCentered ]
        [ Bulma.Elements.title H1
            (List.append styleBold [ style "margin-bottom" "3%" ])
            [ text "Chew Paper Box"
            ]
        , Bulma.Elements.title H2
            (List.append styleNormal [ style "margin-bottom" "3%" ])
            [ text ("Score: " ++ String.fromInt model.score)
            ]
        ]


deck : Html Msg
deck =
    columns { columnsModifiers | gap = Gap3 }
        []
        [ card
        , card
        , card
        , card
        ]


card : Html Msg
card =
    column columnModifiers
        []
        [ notification Primary
            [ onClick Eat ]
            [ cardPlaceholderImage
            ]
        ]


cardPlaceholderImage : Html Msg
cardPlaceholderImage =
    easyPlaceholderImage (OneByOne Unbounded) [ style "position" "static" ]


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
                    [ onClick ChangeHero, style "margin-top" "5%" ]
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
        , Bulma.Elements.title H1
            styleBold
            [ text model.name
            ]
        , Bulma.Elements.subtitle H3
            styleNormal
            [ text model.desc
            ]
        ]


heart : Html Msg
heart =
    image (OneByOne X64)
        []
        [ img [ src "../images/hero/heart.png" ] []
        ]



-- STYLE


styleBold : List (Attribute msg)
styleBold =
    [ style "font-family" "font", style "font-weight" "bold" ]


styleNormal : List (Attribute msg)
styleNormal =
    [ style "font-family" "font" ]
