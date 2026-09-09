import '@shopify/ui-extensions/preact';
import {render} from "preact";

// 1. Export the extension
export default async () => {
  render(<Extension />, document.body)
};

function Extension() {
  // 2. Read the merchant-configured note (JSON, keyed by language code)
  const {note_content} = shopify.settings.value;
  const note = getNoteForLanguage(note_content, shopify.localization.language.value?.isoCode);

  if (!note) {
    return null;
  }

  // 3. Render the note
  return (
    <s-box padding="base" borderRadius="base" background="subdued">
      <s-paragraph color="subdued" textAlign="left">{note.text}</s-paragraph>
    </s-box>
    
  );
}

// Picks the note entry matching the buyer's language, falling back to
// "en", then to whichever language the merchant entered first.
function getNoteForLanguage(rawJson, isoCode) {
  if (!rawJson) {
    return null;
  }

  let notesByLanguage;
  try {
    notesByLanguage = JSON.parse(rawJson);
  } catch {
    return null;
  }

  if (!notesByLanguage || typeof notesByLanguage !== "object") {
    return null;
  }

  const language = (isoCode ?? "").toLowerCase();
  const languageBase = language.split("-")[0];

  const note =
    notesByLanguage[language] ??
    notesByLanguage[languageBase] ??
    notesByLanguage.en ??
    Object.values(notesByLanguage)[0];

  if (!note || !note.text) {
    return null;
  }

  return note;
}
