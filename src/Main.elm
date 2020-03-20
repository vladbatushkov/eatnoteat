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
                [ header
                , stock
                , panel
                ]
            ]
        ]


header : Html msg
header =
    columns columnsModifiers
        []
        [ column columnModifiers
            []
            []
        , column columnModifiers
            []
            [ score
            ]
        , column columnModifiers
            []
            []
        ]


score : Html msg
score =
    container [ textCentered ]
        [ p []
            [ text "Score: 10"
            ]
        ]


stock : Html msg
stock =
    columns { columnsModifiers | gap = Gap3 }
        []
        [ column columnModifiers
            []
            [ card "Card 1"
            ]
        , column columnModifiers
            []
            [ card "Card 2"
            ]
        , column columnModifiers
            []
            [ card "Card 3"
            ]
        , column columnModifiers
            []
            [ card "Card 4"
            ]
        ]


card : String -> Html msg
card content =
    notification Primary
        []
        [ text content
        ]


panel : Html msg
panel =
    columns columnsModifiers
        []
        [ column columnModifiers
            []
            [ myGrid
            ]
        ]

myGrid : Html msg
myGrid
  = tileAncestor Auto []
    [ tileParent Width2 [] 
      [ tileChild Auto [] [ profile ]
      ]
      , tileParent Width3 [] 
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
