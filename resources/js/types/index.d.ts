// resources/js/types/index.d.ts
import { PageProps as BasePageProps } from "@inertiajs/core";

interface AuthUser {
  id: number;
  name: string;
  prenom: string;
  email: string;
  num: string;
  roles: string[];
}

export interface AuthPageProps extends BasePageProps {
  auth: {
    user: AuthUser;
    token: string
  };
}
