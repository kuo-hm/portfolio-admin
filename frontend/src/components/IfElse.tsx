export function IfElse({
  condition,
  children,
}: {
  condition: boolean;
  children: [React.ReactNode, React.ReactNode];
}) {
  return condition ? children[0] : children[1];
}
