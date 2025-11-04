import React from "react";
import UserTable from "./UserTable";

interface Props {
  searchParams: { sortOrder?: string };
}

const UsersPage = async ({ searchParams }: Props) => {
  const sortOrder = searchParams.sortOrder || "name";

  return (
    <>
      <h1>Users</h1>
      {/* @ts-expect-error Async Server Component */}
      <UserTable sortOrder={sortOrder} />
    </>
  );
};

export default UsersPage;
