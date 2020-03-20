module Main exposing (..)

import Browser
import Bulma.CDN exposing (..)
import Bulma.Columns exposing (..)
import Bulma.Elements exposing (..)
import Bulma.Layout exposing (..)
import Bulma.Modifiers exposing (..)
import Bulma.Modifiers.Typography exposing (textAlignment, textCentered)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)



-- MAIN


main : Program () Model Msg
main =
    Browser.sandbox { init = init, update = update, view = view }



-- MODEL


type alias Model =
    Int


init : Model
init =
    0



-- UPDATE


type Msg
    = Increment
    | Decrement


update : Msg -> Model -> Model
update msg model =
    case msg of
        Increment ->
            model + 1

        Decrement ->
            model - 1



-- VIEW


view : Model -> Html Msg
view _ =
    main_ []
        [ stylesheet
        , exampleHero
        ]


exampleHero : Html msg
exampleHero =
    hero { heroModifiers | size = Large, color = Light, bold = True }
        []
        [ heroBody []
            [ container []
                [ score
                , deck
                , panel
                ]
            ]
        ]


score : Html msg
score =
    container [ textCentered ]
        [ Bulma.Elements.title H1
            [ style "margin-bottom" "10%"]
            [ text "Score: 10"
            ]
        ]


deck : Html msg
deck =
    columns { columnsModifiers | gap = Gap3 }
        []
        [ column columnModifiers
            []
            [ card
            ]
        , column columnModifiers
            []
            [ card
            ]
        , column columnModifiers
            []
            [ card
            ]
        , column columnModifiers
            []
            [ card
            ]
        ]


card : Html msg
card =
    notification Primary
        []
        [ img
        ]


img : Html msg
img =
    easyPlaceholderImage (OneByOne Unbounded) [ style "position" "static" ]


panel : Html msg
panel =
    tileAncestor Auto
        []
        [ tileParent Width2
            []
            [ tileChild Auto [] [ profile ]
            ]
        , tileParent Width3
            []
            [ tileChild Auto [] [ heart ]
            , tileChild Auto [] [ heart ]
            , tileChild Auto [] [ heart ]
            ]
        ]


profile : Html msg
profile =
    easyPlaceholderImage (OneByOne X128) []


heart : Html msg
heart =
    easyPlaceholderImage (OneByOne X64) []
