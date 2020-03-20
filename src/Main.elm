module Main exposing (..)

-- Press buttons to increment and decrement a counter.
--
-- Read how it works:
--   https://guide.elm-lang.org/architecture/buttons.html
--

import Browser
import Bulma.CDN exposing (..)
import Bulma.Columns exposing (..)
import Bulma.Elements exposing (..)
import Bulma.Layout exposing (..)
import Bulma.Modifiers exposing (..)
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
    hero { heroModifiers | size = Large, color = Warning, bold = True }
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
            [ text "Score"
            ]
        ]
        

stock : Html msg
stock =
    columns { columnsModifiers | gap = Gap3 }
        []
        [ column columnModifiers
            []
            [ text "Card 1"
            ]
        , column columnModifiers
            []
            [ text "Card 2"
            ]
        , column columnModifiers
            []
            [ text "Card 3"
            ]
        ]
        
panel : Html msg
panel =
    columns { columnsModifiers | gap = Gap3 }
        []
        [ column columnModifiers
            []
            [ text "Profile"
            ]
        , column columnModifiers
            []
            [ text "Heart 1"
            ]
        , column columnModifiers
            []
            [ text "Heart 2"
            ]
        , column columnModifiers
            []
            [ text "Heart 3"
            ]
        ]
