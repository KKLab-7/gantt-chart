type Task = {
    id: number;
    uuid: string;
    name: string;
    program_id: number;
    type: string;
    start: Date;
    end: Date;
    order: string | null;
    isDisabled: boolean;
    progress: number;
    project: string | null;
    hideChildren: boolean | null;
    dependencies: string | null;
};

export const generateTasks = (table: {
    id: number;
    uuid: string;
    name: string;
    program_id: number;
    type: string;
    start: Date;
    end: Date;
    order: string | null;
    isDisabled: boolean;
    progress: number;
    project: string;
    hideChildren: boolean | null;
    dependencies: string | null;
}): Task => {
    return {
        id: table.id,
        uuid: table.uuid,
        name: table.name,
        program_id: table.program_id,
        type: table.type,
        start: table.start,
        end: table.end,
        order: table.order,
        isDisabled: table.isDisabled,
        progress: table.progress,
        project: table.project,
        hideChildren: table.hideChildren,
        dependencies: table.dependencies,
    };
};
