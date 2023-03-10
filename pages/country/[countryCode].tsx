import { useRouter } from "next/router";

export default function Page() {
  const {
    query: { countryCode },
  } = useRouter();
  console.log(countryCode);
  return <div>{countryCode}</div>;
}
