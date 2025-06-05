import React, { FC } from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { TablerIcon } from "@hive/esm-core-components";
import { PiletApi } from "@hive/esm-shell-app";
import OrgaznizationForm from "../forms/OrgaznizationForm";

type AddOrganizationQucikActionProps = {
  piral: PiletApi;
};
const AddOrganizationQucikAction: FC<AddOrganizationQucikActionProps> = ({
  piral: { launchWorkspace },
}) => {
  const handleClick = () => {
    const dispose = launchWorkspace(
      <OrgaznizationForm onCloseWorkspace={() => dispose()} />,
      {
        title: "Register new Oraganization",
      }
    );
  };
  return (
    <Tooltip label="Add Organization">
      <ActionIcon
        size={35}
        radius={"50%"}
        variant="outline"
        aria-label="Add organization action icon button"
        onClick={handleClick}
      >
        <TablerIcon name="plus" size={24} />
      </ActionIcon>
    </Tooltip>
  );
};

export default AddOrganizationQucikAction;
