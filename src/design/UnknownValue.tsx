

interface UnknownValueProps {
  text?: string;
}

export function UnknownValue({ text = 'Not recorded' }: UnknownValueProps) {
  return (
    <span className="text-espresso-40 italic">
      {text}
    </span>
  );
}
