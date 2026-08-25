'==============================================================================
' Software engineering metrics capture form, for Microsoft Excel
'
' The Excel counterpart of index.html. Same twelve questions, same names, same
' allowed values, same UTC rule. One filled-in form produces one row of data.
'
' HOW TO INSTALL
'   1. In Excel, press Alt+F11 to open the Visual Basic editor.
'      (On a Mac: Tools > Macro > Visual Basic Editor.)
'   2. Insert > Module.
'   3. Paste this whole file into the code window.
'   4. Press Alt+Q to go back to Excel, then Alt+F8, choose ShowMetricsForm,
'      and click Run.
'
'   To import this file rather than paste it, add this as the very first line:
'      Attribute VB_Name = "MetricsForm"
'   then use File > Import File in the Visual Basic editor. The line is left
'   out here because it is a file-format directive: pasting it into the code
'   window is a syntax error.
'
' WHAT IT MAKES
'   "Metrics Form"  the form you fill in.
'   "Metrics Data"  one header row, then one row per submission. The columns
'                   are the same, in the same order, as the TSV that
'                   index.html exports, so the two can be combined.
'
' WHY A SHEET AND NOT A USERFORM
'   A UserForm cannot be created by pasting code. It lives in a .frm file that
'   has to be imported, or has to be built at run time through the VBA project
'   object model, which is blocked by default and which most people cannot
'   enable. A sheet-based form pastes and runs anywhere, needs no trust
'   setting, and an Excel user already knows how to use it.
'==============================================================================

Option Explicit

Private Const FORM_SHEET As String = "Metrics Form"
Private Const DATA_SHEET As String = "Metrics Data"

Private Const TITLE_ROW As Long = 1
Private Const STATUS_ROW As Long = 2
Private Const FIRST_FIELD_ROW As Long = 4

Private Const LABEL_COLUMN As Long = 2
Private Const INPUT_COLUMN As Long = 3
Private Const HINT_COLUMN As Long = 4

' Set by UtcNow. False means this machine could not convert local time to UTC,
' and the operator has to supply the UTC date and time by hand.
Private mUtcAvailable As Boolean

Private Type FieldSpec
    Name As String          ' the column heading, and the name in every other form
    Caption As String       ' the question, worded as index.html words it
    Kind As String          ' text, email, date, time, choice, notes
    Required As Boolean
    Choices As String       ' allowed values, comma separated, for Kind = choice
    Hint As String          ' shown beside the input cell
End Type

'------------------------------------------------------------------------------
' The questions, in the order they are asked. This is the one place they are
' declared: the form, the validation, and the data columns all read from here.
'------------------------------------------------------------------------------
Private Function Fields() As FieldSpec()
    Dim f(1 To 12) As FieldSpec

    f(1) = MakeField("email", "Your email address?", "email", True, "", "ann.adams@example.com")
    f(2) = MakeField("organization", "Which organization / office / outfit / etc.?", _
                     "text", True, "", "ACME Incorporated")
    f(3) = MakeField("division", "Which division / department / directorate / etc.?", _
                     "text", True, "", "Sales Division")
    f(4) = MakeField("plan", "Which plan / project / product / practice / etc.?", _
                     "text", True, "", "Phoenix Plan")
    f(5) = MakeField("task", "Which task / todo / topic / etc.?", _
                     "text", True, "", "Add feature X")
    f(6) = MakeField("step", "Which step / stage / phase / queue / etc.?", _
                     "text", True, "", "User Acceptance Testing")
    f(7) = MakeField("status", "What status / step / change / etc.?", _
                     "text", True, "", "Start")
    f(8) = MakeField("date", "When is this occurring? Date (UTC)", _
                     "date", True, "", "yyyy-mm-dd, in UTC")
    f(9) = MakeField("time", "When is this occurring? Time (UTC)", _
                     "time", True, "", "hh:mm on a 24 hour clock, in UTC")
    f(10) = MakeField("collection", "Collection method?", "choice", False, _
                      "estimate,manual,assisted,automatic", _
                      "estimate | manual | assisted (some manual, some automatic) | automatic")
    f(11) = MakeField("confidence", "Confidence in this information?", "choice", False, _
                      "low,medium,high", _
                      "low (known gaps) | medium (spot-checked) | high (verified)")
    f(12) = MakeField("notes", "Any notes, such as narratives, sources, extras, ideas?", _
                      "notes", False, "", "Optional")

    Fields = f
End Function

Private Function MakeField(ByVal name As String, ByVal caption As String, _
                           ByVal kind As String, ByVal required As Boolean, _
                           ByVal choices As String, ByVal hint As String) As FieldSpec
    Dim spec As FieldSpec
    spec.Name = name
    spec.Caption = caption
    spec.Kind = kind
    spec.Required = required
    spec.Choices = choices
    spec.Hint = hint
    MakeField = spec
End Function

'==============================================================================
' The three macros an operator runs
'==============================================================================

'------------------------------------------------------------------------------
' Build the form if it is not there, then show it ready to fill in.
'------------------------------------------------------------------------------
Public Sub ShowMetricsForm()
    Dim ws As Worksheet
    Application.ScreenUpdating = False
    Set ws = BuildForm()
    Application.ScreenUpdating = True

    ws.Activate
    ws.Cells(FIRST_FIELD_ROW, INPUT_COLUMN).Select
End Sub

'------------------------------------------------------------------------------
' Check the answers, then write one row. Nothing is written unless every
' answer passes, so a rejected form never leaves a half-filled row behind.
'------------------------------------------------------------------------------
Public Sub SubmitMetricsForm()
    Dim ws As Worksheet
    Dim data As Worksheet
    Dim spec() As FieldSpec
    Dim answers() As String
    Dim problems As String
    Dim index As Long
    Dim targetRow As Long

    Set ws = FormSheet(False)
    If ws Is Nothing Then
        MsgBox "Run ShowMetricsForm first.", vbExclamation, "No form yet"
        Exit Sub
    End If

    spec = Fields()
    ReDim answers(LBound(spec) To UBound(spec))

    For index = LBound(spec) To UBound(spec)
        answers(index) = Trim$(CStr(ws.Cells(FieldRow(index), INPUT_COLUMN).Value))
        problems = problems & Problem(spec(index), answers(index))
    Next index

    If Len(problems) > 0 Then
        SetStatus ws, "Not submitted. Fix the answers listed, then submit again.", True
        MsgBox "This form is not ready to submit:" & vbCrLf & vbCrLf & problems, _
               vbExclamation, "Check these answers"
        Exit Sub
    End If

    Set data = DataSheet()
    If data Is Nothing Then Exit Sub

    targetRow = data.Cells(data.Rows.Count, 1).End(xlUp).Row + 1
    For index = LBound(spec) To UBound(spec)
        With data.Cells(targetRow, index)
            .NumberFormat = "@"     ' keep 2026-12-31 and 12:59 exactly as written
            .Value = answers(index)
        End With
    Next index

    ClearAnswers ws
    SetStatus ws, "Row " & (targetRow - 1) & " written to the " & DATA_SHEET & _
                  " sheet. The form is ready for the next one.", False
    ws.Cells(FIRST_FIELD_ROW, INPUT_COLUMN).Select
End Sub

'------------------------------------------------------------------------------
' Empty every answer and put the UTC date and time back to now.
'------------------------------------------------------------------------------
Public Sub ClearMetricsForm()
    Dim ws As Worksheet
    Set ws = FormSheet(False)
    If ws Is Nothing Then
        MsgBox "Run ShowMetricsForm first.", vbExclamation, "No form yet"
        Exit Sub
    End If

    ' Answers on the form have not reached the data sheet yet, so this throws
    ' away work that exists nowhere else. Ask first.
    If MsgBox("Clear every answer on the form?" & vbCrLf & vbCrLf & _
              "Rows already written to the " & DATA_SHEET & " sheet are kept.", _
              vbYesNo + vbQuestion + vbDefaultButton2, "Clear") <> vbYes Then Exit Sub

    ClearAnswers ws
    SetStatus ws, "Cleared.", False
End Sub

'==============================================================================
' Building the form
'==============================================================================

Private Function BuildForm() As Worksheet
    Dim ws As Worksheet
    Dim spec() As FieldSpec
    Dim index As Long
    Dim row As Long

    Set ws = FormSheet(True)
    ws.Cells.Clear
    On Error Resume Next
    ws.Shapes("SubmitButton").Delete
    ws.Shapes("ClearButton").Delete
    On Error GoTo 0

    ws.Cells(TITLE_ROW, LABEL_COLUMN).Value = "Software engineering metrics form"
    With ws.Cells(TITLE_ROW, LABEL_COLUMN).Font
        .Bold = True
        .Size = 16
    End With

    spec = Fields()
    For index = LBound(spec) To UBound(spec)
        row = FieldRow(index)

        ws.Cells(row, LABEL_COLUMN).Value = spec(index).Caption & Marker(spec(index))
        ws.Cells(row, LABEL_COLUMN).Font.Bold = True
        ws.Cells(row, LABEL_COLUMN).HorizontalAlignment = xlRight

        With ws.Cells(row, INPUT_COLUMN)
            .NumberFormat = "@"     ' text, so a date is never rewritten by Excel
            .Interior.Color = RGB(255, 255, 255)
            .Borders.LineStyle = xlContinuous
            .Borders.Color = RGB(190, 200, 210)
            .HorizontalAlignment = xlLeft
            .Validation.Delete
        End With

        If spec(index).Kind = "choice" Then AddChoices ws.Cells(row, INPUT_COLUMN), spec(index)
        If spec(index).Kind = "notes" Then ws.Cells(row, INPUT_COLUMN).WrapText = True

        With ws.Cells(row, HINT_COLUMN)
            .Value = spec(index).Hint
            .Font.Italic = True
            .Font.Color = RGB(110, 125, 140)
        End With
    Next index

    ws.Cells(STATUS_ROW, LABEL_COLUMN).Value = "Fill in every question marked *, then click Submit."
    ws.Cells(STATUS_ROW, LABEL_COLUMN).Font.Italic = True

    ws.Columns(LABEL_COLUMN).ColumnWidth = 46
    ws.Columns(INPUT_COLUMN).ColumnWidth = 42
    ws.Columns(HINT_COLUMN).ColumnWidth = 52
    ws.Rows(FieldRow(UBound(spec))).RowHeight = 46      ' room for the notes
    ws.Cells(1, 1).ColumnWidth = 3

    AddButton ws, "SubmitButton", "Submit metrics", "SubmitMetricsForm", 0, UBound(spec)
    AddButton ws, "ClearButton", "Clear the form", "ClearMetricsForm", 120, UBound(spec)

    ClearAnswers ws
    Set BuildForm = ws
End Function

Private Sub AddChoices(ByVal target As Range, ByRef spec As FieldSpec)
    ' A value the form does not offer is refused outright, the same way the web
    ' form refuses one: no near-enough matching, no quiet substitution.
    With target.Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, _
             Operator:=xlBetween, Formula1:=spec.Choices
        .IgnoreBlank = Not spec.Required
        .InCellDropdown = True
        .ErrorTitle = "Not an offered value"
        .ErrorMessage = "Choose one of: " & Replace(spec.Choices, ",", ", ")
        .ShowError = True
    End With
End Sub

Private Sub AddButton(ByVal ws As Worksheet, ByVal name As String, ByVal caption As String, _
                      ByVal macro As String, ByVal offset As Double, ByVal lastField As Long)
    Dim button As Object
    Dim topEdge As Double

    topEdge = ws.Cells(FieldRow(lastField) + 2, LABEL_COLUMN).Top
    Set button = ws.Shapes.AddShape(msoShapeRoundedRectangle, _
                                    ws.Columns(INPUT_COLUMN).Left + offset, topEdge, 110, 28)
    button.name = name
    button.TextFrame.Characters.Text = caption
    button.OnAction = macro
End Sub

'==============================================================================
' Reading, clearing, reporting
'==============================================================================

Private Sub ClearAnswers(ByVal ws As Worksheet)
    Dim spec() As FieldSpec
    Dim index As Long
    Dim stamp As Date

    spec = Fields()
    stamp = UtcNow()

    For index = LBound(spec) To UBound(spec)
        Select Case spec(index).Kind
            Case "date"
                ws.Cells(FieldRow(index), INPUT_COLUMN).Value = Format$(stamp, "yyyy-mm-dd")
            Case "time"
                ' "nn" is minutes in VBA. "mm" would give the month.
                ws.Cells(FieldRow(index), INPUT_COLUMN).Value = Format$(stamp, "hh:nn")
            Case Else
                ws.Cells(FieldRow(index), INPUT_COLUMN).ClearContents
        End Select
    Next index

    If Not mUtcAvailable Then
        SetStatus ws, "This machine could not convert to UTC, so the date and time above " & _
                      "are LOCAL. Correct them to UTC before submitting.", True
    End If
End Sub

Private Sub SetStatus(ByVal ws As Worksheet, ByVal message As String, ByVal isProblem As Boolean)
    With ws.Cells(STATUS_ROW, LABEL_COLUMN)
        .Value = message
        .Font.Italic = True
        If isProblem Then
            .Font.Color = RGB(150, 30, 25)
            .Font.Bold = True
        Else
            .Font.Color = RGB(110, 125, 140)
            .Font.Bold = False
        End If
    End With
End Sub

'------------------------------------------------------------------------------
' One answer, checked. Returns "" when the answer is good, otherwise a line
' naming what is wrong with it.
'------------------------------------------------------------------------------
Private Function Problem(ByRef spec As FieldSpec, ByVal answer As String) As String
    If Len(answer) = 0 Then
        If spec.Required Then
            Problem = "  " & spec.Name & ": needs an answer." & vbCrLf
        End If
        Exit Function
    End If

    Select Case spec.Kind
        Case "email"
            If InStr(answer, "@") = 0 Or InStr(answer, ".") = 0 Then
                Problem = "  " & spec.Name & ": does not look like an email address." & vbCrLf
            End If

        Case "date"
            If Not answer Like "####-##-##" Then
                Problem = "  " & spec.Name & ": write the UTC date as yyyy-mm-dd." & vbCrLf
            ElseIf Not IsDate(answer) Then
                Problem = "  " & spec.Name & ": that is not a real date." & vbCrLf
            End If

        Case "time"
            If Not answer Like "##:##" Then
                Problem = "  " & spec.Name & ": write the UTC time as hh:mm." & vbCrLf
            ElseIf CLng(Left$(answer, 2)) > 23 Or CLng(Right$(answer, 2)) > 59 Then
                Problem = "  " & spec.Name & ": that is not a real time." & vbCrLf
            End If

        Case "choice"
            If Not IsOffered(spec.Choices, answer) Then
                Problem = "  " & spec.Name & ": must be one of " & _
                          Replace(spec.Choices, ",", ", ") & "." & vbCrLf
            End If
    End Select
End Function

Private Function IsOffered(ByVal choices As String, ByVal answer As String) As Boolean
    Dim offered As Variant
    Dim item As Variant

    offered = Split(choices, ",")
    For Each item In offered
        If CStr(item) = answer Then       ' exact, not case-insensitive
            IsOffered = True
            Exit Function
        End If
    Next item
End Function

'==============================================================================
' Sheets
'==============================================================================

Private Function FormSheet(ByVal createIfMissing As Boolean) As Worksheet
    Dim ws As Worksheet
    On Error Resume Next
    Set ws = ThisWorkbook.Worksheets(FORM_SHEET)
    On Error GoTo 0

    If ws Is Nothing And createIfMissing Then
        Set ws = ThisWorkbook.Worksheets.Add(Before:=ThisWorkbook.Worksheets(1))
        ws.name = FORM_SHEET
    End If
    Set FormSheet = ws
End Function

'------------------------------------------------------------------------------
' The data sheet, with its header row. If a sheet is already there with a
' different header, stop: writing into it would put answers under the wrong
' headings, which is worse than refusing.
'------------------------------------------------------------------------------
Private Function DataSheet() As Worksheet
    Dim ws As Worksheet
    Dim spec() As FieldSpec
    Dim index As Long

    spec = Fields()

    On Error Resume Next
    Set ws = ThisWorkbook.Worksheets(DATA_SHEET)
    On Error GoTo 0

    If ws Is Nothing Then
        Set ws = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
        ws.name = DATA_SHEET
        For index = LBound(spec) To UBound(spec)
            ws.Cells(1, index).Value = spec(index).Name
            ws.Cells(1, index).Font.Bold = True
        Next index
        ws.Rows(1).AutoFilter
        Set DataSheet = ws
        Exit Function
    End If

    For index = LBound(spec) To UBound(spec)
        If Trim$(CStr(ws.Cells(1, index).Value)) <> spec(index).Name Then
            MsgBox "The " & DATA_SHEET & " sheet has a different header row." & vbCrLf & vbCrLf & _
                   "Column " & index & " reads """ & ws.Cells(1, index).Value & _
                   """ but this form writes """ & spec(index).Name & """." & vbCrLf & vbCrLf & _
                   "Nothing has been written. Rename or move that sheet, then submit again.", _
                   vbCritical, "Headings do not match"
            Exit Function
        End If
    Next index

    Set DataSheet = ws
End Function

'==============================================================================
' Helpers
'==============================================================================

Private Function FieldRow(ByVal index As Long) As Long
    FieldRow = FIRST_FIELD_ROW + index - 1
End Function

Private Function Marker(ByRef spec As FieldSpec) As String
    If spec.Required Then Marker = " *"
End Function

'------------------------------------------------------------------------------
' Now, in UTC. Excel has no UTC clock, so this asks Windows to convert. Where
' that is unavailable, such as Excel for Mac, it falls back to local time and
' sets mUtcAvailable to False so the form can say so out loud. Recording a
' local time in a column labelled UTC would make two offices incomparable,
' which is the whole reason these fields say UTC.
'------------------------------------------------------------------------------
Private Function UtcNow() As Date
    Dim converter As Object

    On Error GoTo Fallback
    Set converter = CreateObject("WbemScripting.SWbemDateTime")
    converter.SetVarDate Now
    UtcNow = converter.GetVarDate(False)
    mUtcAvailable = True
    Exit Function

Fallback:
    mUtcAvailable = False
    UtcNow = Now
End Function
