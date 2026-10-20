import React from "react";
import { parseBlocks, parseInline } from "@/lib/richText";

const Inline = ({ line }: { line: string }) => (
  <>
    {parseInline(line).map((part, index) => {
      switch (part.type) {
        case "bold":
          return <strong key={index}>{part.value}</strong>;
        case "italic":
          return <em key={index}>{part.value}</em>;
        case "underline":
          return <u key={index}>{part.value}</u>;
        case "link":
          return (
            <a
              key={index}
              href={part.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-light-green underline"
            >
              {part.value}
            </a>
          );
        default:
          return <React.Fragment key={index}>{part.value}</React.Fragment>;
      }
    })}
  </>
);

// Shows a description written with RichTextField, without ever rendering HTML.
export const FormattedText = ({ text, className = "" }: { text: string; className?: string }) => (
  <div className={`space-y-1 break-words ${className}`}>
    {parseBlocks(text).map((block, index) => {
      if (block.type === "paragraph") {
        return (
          <p key={index} style={{ marginLeft: `${block.line.indent}rem` }}>
            <Inline line={block.line.text} />
          </p>
        );
      }
      const List = block.type === "bullets" ? "ul" : "ol";
      return (
        <List
          key={index}
          className={`pl-5 ${block.type === "bullets" ? "list-disc" : "list-decimal"}`}
        >
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} style={{ marginLeft: `${item.indent}rem` }}>
              <Inline line={item.text} />
            </li>
          ))}
        </List>
      );
    })}
  </div>
);
