# OPExtensions - Open Project Extensions

Developed for Open Project version  ...

List of extensions:

 - Additional buttons (prev, current, mix) in description diff view
 - Additional button in work package view allowing to fold right panel
 - Fixes table of contents when using `{{toc}}`
 - Allow to click on work package description without edit, edit button is on the right of text content as gray strip
 - Save edited work package description with CTLR+S

Disabled by default extensions:
 - Smaller left sidebar menu and right panel - bigger center content view in work package view
 - Syntax reference in left sidebar all the time in work package view

## Diff View with new buttons
![](https://github.com/gabr/opextensions/raw/master/diffView.png)

## Folding right panel in Work Package view
![](https://github.com/gabr/opextensions/raw/master/foldingRightPanel.png)

# Notes

## Open Project font

Link: ip/openproject/assets/openproject_icon/openproject-icon-font-0fa57de9920f071d47c64a90b2dc00b6.woff
Viewer: https://fontdrop.info/

# TODO

Api: `$HOME\Documents\WindowsPowerShell\Scripts\GetOpenProject-CloseStatusForWP.ps1`

- monitorowanie ilości wykonanych tasków OP w pracy
  [x] przycisk do pokazywania/ukrywania widoku wizualiacji
  [x] pobieranie i wyświetlanie listy moich wp
  [ ] ograniczenie pobierania wp do wybranego okresu czasu (np ostatni tydzień/dwa)
  [ ] grupowanie pobranych wp na dni
  [ ] grupowanie pobranych wp na nowe/zaktualizowane/zamknięte/bugi
  [ ] poprawienie wyglądu
  [ ] wykres
- spis treści cały czas widoczny i pokazujący gdzie się znajdujesz w dokumencie

- automatyczne przypisywanie mnie do zadania przy tworzeniu nowych
- automatyczna struktura opisu przy tworzeniu nowych zadań
- dodanie przycisku, który pozwala od razu utworzyć BUG/TASK by potem nie trzeba było zmieniać typu
- gotowe listy wyborów do pól Requested By itd
- numeracja spisu treści i nagłówków
- usuwanie wszystkich filtrów jednym małym guziczkiem obok guzyka filtrów

- edytor WYSIWYG
- wykrywanie konfliktu edycji w trakcie edycji
- automatyczne wykrywanie podmiany treści w rodzicu przy edycji dziecka
- widok blame

