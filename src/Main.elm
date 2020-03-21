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
    { name : String
    , desc : String
    , picture : String
    }


arnold : Hero
arnold =
    Hero "Arnold" "Eat all the trash and junk. Never touch normal food." "./images/Hero/arnold.png"


chuck : Hero
chuck =
    Hero "Chuck" "Never smile. True vegeterian: fruits and vegetables only. Hate all the rest." "./images/Hero/chuck.png"


terry : Hero
terry =
    Hero "Terry" "Fast-food maniac. Meat lover. Vomit for desserts." "./images/Hero/terry.png"


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model 0 3 chuck, Cmd.none )



-- UPDATE


type Msg
    = Eat


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Eat ->
            ( { model | score = model.score + 1, hp = model.hp - 1 }, Cmd.none )



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
                , panel
                ]
            ]
        ]


score : Model -> Html msg
score model =
    container [ textCentered ]
        [ Bulma.Elements.title H1
            [ style "margin-bottom" "10%" ]
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
            [ img
            ]
        ]


img : Html Msg
img =
    easyPlaceholderImage (OneByOne Unbounded) [ style "position" "static" ]


panel : Html Msg
panel =
    tileAncestor Auto
        []
        [ tileParent Width2
            []
            [ tileChild Auto
                []
                [ profile
                , text "Chuck"
                ]
            ]
        , tileParent Width3
            []
            [ tileChild Auto [] [ heart ]
            , tileChild Auto [] [ heart ]
            , tileChild Auto [] [ heart ]
            ]
        ]


profile : Html Msg
profile =
    easyPlaceholderImage (OneByOne X128) []


heart : Html Msg
heart =
    easyPlaceholderImage (OneByOne X64) []
