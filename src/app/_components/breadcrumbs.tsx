"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

const Breadcrumbs = () => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  console.log('pathNames', pathNames)

  return (
    <div className="hidden md:inline-flex">
      <Breadcrumb>
        <BreadcrumbList>
          {pathNames.length === 0 ? (
            <BreadcrumbItem>
              <BreadcrumbPage>Hjem</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem key={`first_${0}_/`}>
              <BreadcrumbLink href="/">Hjem</BreadcrumbLink>
            </BreadcrumbItem>
          )}
          <BreadcrumbSeparator />
          {pathNames.map((link, index) => {
            return (
              <React.Fragment key={`${index}_${link}`}>
                {index < pathNames.length - 1 ? (
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/${link}`}>{link}</BreadcrumbLink>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{link}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}

                {index < pathNames.length - 1 ? (
                  <BreadcrumbSeparator />
                ) : undefined}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
