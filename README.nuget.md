# Open or Closed for Umbraco

![Open or Closed Logo](https://raw.githubusercontent.com/YourITGroup/OpenOrClosed/master/GithubFiles/Logo/OpenOrClosed_logo.png)

Yet another Business Hours package supporting Umbraco 12+

Adds Property Editors to manage standard and special (read holiday) opening/closing times

The OpenOrClosed.Core nuget package can be used in Core projects to add support for ModelsBuilder generated Content Models.

Inspired by the Dexmoor BusinessHours package, this one uses the built-in date and time picker and targets Umbraco 8.6+

There are two nuGet packages:

* OpenOrClosed - DataType Definitions and Property Editors for the Umbraco Back-Office
* OpenOrClosed.Core - PropertyValueConverters for use with ModelsBuilder to provide strongly typed models.

## Property Editors

### Standard Business Hours

Monday through to Sunday and optionally Bank Holidays, set each day Open or Closed with multiple ranges of times in either 24- or 12-hour time.  Each time range can be flagged with "By Appointment".

### Special Business Hours

Adds the ability to specify specific dates, with the same set of features for Standard Business Hours.

## Change Log

### Versiib 3.0.0

* Now targeting Umbraco 12+
* Better layout of Property Editor UI
* Changed to a Razor Component Library

### Version 2.0.1

* Standard Hours now reflect the current week for the OpensAt and ClosesAt lists

### Version 2.0.0

* Supports Umbraco 10+ only - for Umbraco 8 or 9 install version 1.1.0
* Hours are now optional, allowing for a Days Open/Closed facility without the need to specify times.
* Special Days can now be default to closed when added.
* System.DayOfWeek is now included in the StandardHours View Model, assisting with the ability to render a localised Day.

### Version 1.1.0

* Closed Times can now be made optional by configuration (breaking change)

### Version 1.0.0

* Supports both Umbraco 8 and Umbraco 9

### Version 0.2.2 ***Potential BREAKING Change***

* Changes the Hours from string to DateTime in the View Model to enable better localisation support.

### Version 0.2.1

* Removes the Id property from the View Models since it's no longer populated anyway.

### Version 0.2.0

* Removes the Id property from the editor as it's redundant
