interface Props {
  detail: string;
  value: string;
}
export default function CardDetail({ detail, value }: Props) {
  return (
    <div>
      <span className="mr-2 font-medium">{detail}:</span>
      <span>{value}</span>
    </div>
  );
}
