// Publication dates come in two spellings of the same thing, a wall-clock time in Brussels:
// the minute-precision string written by the WordPress import ("2025-05-20T09:58") and the string Keystatic
// writes whenever an editor saves an entry ("2025-05-20T09:58:00.000Z"). Keystatic's date field is naive: its input
// shows 09:58 whatever the browser's time zone, and the trailing "Z" is only how it serialises the value, so the
// digits must be kept as they are, not converted. Everything that shows, sorts or exports a date goes through here.

/** "YYYY-MM-DDTHH:mm" from either spelling. Empty string when there is no date. */
export function wallClock(value) {
  const m = String(value ?? '').match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  return m ? m[1] : String(value ?? '').slice(0, 10);
}
