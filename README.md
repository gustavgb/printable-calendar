# printable-calendar

Generate printable A6 weekly planners for the coming year.

## Usage

After installing with `npm install`, run `npm link` to make the package available globally.

To generate a calendar, simply run `printable-calendar` in your terminal. Optinally provide a starting date as the second argument (anything that can be parsed as a Javascript Date object is valid).

To print the calendar, you need to impose the document. Use https://momijizukamori.github.io/bookbinder-js/ with the following settings:

- Source manipulation: None
- Paper Size: A4
- Printer Type: Duplex
- Alternative Page Rotation: **YES** (Long size)
- Page Layout: Quarto
- Signature Format: Booklet

> Note: Currently the generated PDF is in Danish, however this could be changed easily if needed.
