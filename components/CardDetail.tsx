interface Props {
  detail: string;
  value: string;
}
export default function CardDetail({ detail, value }: Props) {
  return (
    <div>
      <span className="mr-2 inline-block font-medium">{detail}:</span>
      <span className="inline-block">{value}</span>
    </div>
  );
}
