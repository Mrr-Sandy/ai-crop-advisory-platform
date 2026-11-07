import { AlertTriangle, Microscope, Phone, Sprout, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// The backend asks Gemini for exactly five bullets in a fixed order (aiController.js):
// diagnosis, immediate actions, precautions, when to call an expert, closing advice.
// When a reply arrives in that shape it is laid out as a consultation; otherwise it
// renders as Markdown.
const PARTS = ["Likely cause", "Act now", "Watch for", "Call an expert", "Recommendation"];
const ICONS = [Microscope, Zap, AlertTriangle, Phone, Sprout];
const BULLET = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/;
const LEAD_LABEL = /^\s*(?:\*\*)?(?:bullet\s*\d+|likely cause|diagnosis|cause|immediate actions?|act now|precautions?(?: and risks(?: to avoid)?)?|risks?|watch for|when to (?:seek|get|call)[^:]*|professional help|closing recommendation|recommendation|summary)\s*[:.-]\s*(?:\*\*)?\s*/i;

function splitBullets(text) {
  const items = [];
  for (const line of String(text).split(/\r?\n/)) {
    const match = BULLET.exec(line);
    if (match) items.push(match[1].trim());
    else if (line.trim() && items.length) items[items.length - 1] += ` ${line.trim()}`;
    else if (line.trim()) return null; // prose before the bullets: not the five-part shape
  }
  return items;
}

const inline = { p: ({ children }) => <>{children}</> };

function Consultation({ text }) {
  const bullets = splitBullets(text);

  if (bullets && bullets.length === PARTS.length) {
    return (
      <ol className="consult m-0 list-none p-0" aria-label="Advisory answer in five parts">
        {bullets.map((item, index) => {
          const Icon = ICONS[index];
          return (
          <li key={PARTS[index]}>
            <p className="consult__label consult__label--icon">
              <span className="consult__icon" aria-hidden="true">
                <Icon className="h-4 w-4" />
              </span>
              {PARTS[index]}
            </p>
            <div className="md">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={inline}>
                {item.replace(LEAD_LABEL, "")}
              </ReactMarkdown>
            </div>
          </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}

export default Consultation;
