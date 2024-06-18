import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const UserWorkBreadcrumb = ({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/user/${userId}`}>{userName}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {/* <BreadcrumbLink asChild>Work</BreadcrumbLink> */}
          Work
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default UserWorkBreadcrumb;
