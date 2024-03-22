import Dropdown from "@/Components/Dropdown";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import CansellButton from "@/Components/CansellButton";
import DropdownMenu from "@/Components/Table/DropdownMenu";
import { GANTTCHART_TYPE, MONTH_NAMES } from "@/Constants/Const";
import * as React from "react";
import { useState } from "react";
import Select from "react-select";
import DeleteButton from "@/Components/DeleteButton";
import axios from "axios";
import { progressOptions } from "@/Constants/OptionsConsts";
import { customStyles } from "@/Constants/Styles";


export default function TaskListTable({ data, setData, destroy, updateTask, programUuid, updateMasterData }) {
    /** Used to switch the display of tasks */
    const [isDeleteModalFlg, setIsDeleteModalFlg] = useState(false);
    const [selectData, setSelectData] = useState([]);
    let projectID = "";
    // 更新するデータを
    const [changeData, setChangeData] = useState({
        uuid: '',
        type: ''
    });
    const onChangeData = (uuid, type) => {

    }
    const onExpanderClick = (task) => {
        setData('tables', data.tables.map(t => {
            if (t.id === task.id) {
                t.hideChildren = !task.hideChildren;
            }
            return t;
        }));
    };

    const onChangeTaskProgress = (value, task) => {
        let totalProgress = 0;
        let totalTime = 0;
        let tables = data.tables.map(t => {
            // change task progress
            if (t.uuid === task.uuid) {
                t.progress = value;
                setChangeData
            }

            // calculate project progress
            if (t.type == GANTTCHART_TYPE.TASK && t.project == task.project) {
                const diffTime = t.end.getTime() - t.start.getTime();
                totalProgress += Number(t.progress * diffTime);
                totalTime += Number(diffTime);
            }
            return t;
        });

        setData('tables', tables.map(t => {
            if (t.uuid === task.project) {
                t.progress = Math.round(totalProgress / totalTime);
            }
            return t;
        }));

        // updateMasterData(task);
        updateTask(task, { progress: value });
    };

    const deleteProjectData = () => {
        destroy(route('api.gantt.chart.program.project.delete',
            {
                programUuid: programUuid,
                projectUuid: selectData.uuid,
            }),
            {
                onSuccess: (e) => {
                    console.log(e);
                },
                onError: (e) => {
                    console.log(e);
                }
            }
        )
    }

    const deleteTaskData = () => {
        destroy(route('gantt.chart.program.project.task.delete',
            {
                programUuid: programUuid,
                projectUuid: selectData.project,
                taskUuid: selectData.uuid,
            }),
            {
                onSuccess: (e) => {
                    console.log(e);
                },
                onError: (e) => {
                    console.log(e);
                }
            }
        )
    }

    const capitalize = (str) => {
        if (str == undefined) {
            return ;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <>
            <div className="_3ZbQT" style={{ fontFamily: "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue", fontSize: "9px" }}>
            {data.tables.map((task) => {
                if (projectID === task.project) {
                    return;
                }
                if (task.hideChildren && task.type === 'project') {
                    projectID = task.id;
                }
                return (
                    <div className="_34SS0" style={{ height: 40 }} key={task.uuid}>
                        <div className="_3lLk3" style={{ minWidth: "155px", maxWidth: "155px" }} title={task.name}>
                            <div className="_nI1Xw" onClick={() => onExpanderClick(task)}>
                                {task.type === 'project' ? 
                                    <div className="_2QjE6">{task.hideChildren ? '▶' : '▼'}</div>
                                    : <div className="_2TfEi"></div>
                                }
                                <div>{task.name}</div>
                            </div>
                        </div>
                        <div className="_3lLk3" style={{ minWidth: "155px", maxWidth: "155px" }}>
                            {MONTH_NAMES[task.start.getMonth()] + " " + task.start.getDate() + ", " + task.start.getFullYear()}
                            〜 
                            {MONTH_NAMES[task.end.getMonth()] + " " + task.end.getDate() + ", " + task.end.getFullYear()}
                        </div>
                        <div className="_3lLk3" style={{ minWidth: "155px", maxWidth: "155px" }}>
                            {
                                task.type === GANTTCHART_TYPE.TASK ?
                                    <Select
                                        name={'task_progress_' + task.id}
                                        options={progressOptions}
                                        styles={customStyles}
                                        defaultValue={progressOptions.filter(option => option.value == task.progress)}
                                        onChange={(e) => onChangeTaskProgress(e.value, task)}
                                    />
                                    : <span className="text-lg">{task.progress + "%"}</span>
                            }
                        </div>
                        <div className="relative">
                            <DropdownMenu>
                                <DropdownMenu.Content>
                                    {
                                        task.type === GANTTCHART_TYPE.PROJECT ?
                                            <>
                                                <DropdownMenu.Link
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectData(task);
                                                        setIsDeleteModalFlg(true);
                                                    }}
                                                >
                                                    Create Task
                                                </DropdownMenu.Link>
                                                <DropdownMenu.Link
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectData(task);
                                                        setIsDeleteModalFlg(true);
                                                    }}
                                                >
                                                    Delete Project
                                                </DropdownMenu.Link>
                                            </>
                                            : 
                                            <DropdownMenu.Link
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectData(task);
                                                    setIsDeleteModalFlg(true);
                                                }}
                                            >
                                                Delete Task
                                            </DropdownMenu.Link>
                                    }
                                </DropdownMenu.Content>
                            </DropdownMenu>
                        </div>
                    </div>
                );
            })}
            </div>
            <Modal show={isDeleteModalFlg} onClose={(e) => setIsDeleteModalFlg(false) }>
                <div className='flex justify-between border-b p-4'>
                    <span>Delete { capitalize(selectData.type) }</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height={24} width={24} onClick={(e) => setIsDeleteModalFlg(false)}>
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                </div>
                <div className="p-4">
                    Are you sure you want to delete 「{selectData.name}」{selectData.type}?
                </div>
                <div className='flex justify-end border-t p-4 '>
                    <CansellButton
                        type="button"
                        onClick={(e) => setIsDeleteModalFlg(false)}
                        className="mr-2"
                    >
                        Cansell
                    </CansellButton>
                    <DeleteButton
                        type="button"
                        onClick={(e) => selectData.type === GANTTCHART_TYPE.PROJECT ? deleteProjectData() : deleteTaskData()}
                    >
                        Delete
                    </DeleteButton>
                </div>
            </Modal>
        </>
    );
}