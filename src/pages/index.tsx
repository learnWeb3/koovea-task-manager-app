import { OidcSecure, useOidcAccessToken } from "@axa-fr/react-oidc";
import Layout from "../components/Layout";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
} from "react";

export default function HomePage() {
  const { accessToken } = useOidcAccessToken();
  return <OidcSecure>{JSON.stringify(accessToken)}</OidcSecure>;
}

HomePage.getLayout = function getLayout(
  page:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | Iterable<ReactNode>
    | ReactPortal
    | PromiseLikeOfReactNode
    | null
    | undefined
) {
  return <Layout>{page}</Layout>;
};
