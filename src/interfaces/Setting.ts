import { InstanceDestroyOptions } from "sequelize/types";

export default interface Setting {
    key: string;
    value: string;

    destroy(options?: InstanceDestroyOptions | undefined): Promise<void>;
}
