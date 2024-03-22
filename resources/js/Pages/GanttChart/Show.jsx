import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head, useForm } from '@inertiajs/react';
import { StrictMode, useState } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import TaskListHeader from './Partials/TaskListHeader';
import TaskListTable from './Partials/TaskListTable';
import CreateProgramModal from './Partials/CreateProgramModal';
import React from 'react';
import CreateTaskModal from './Partials/CreateTaskModal';
import { Input, InputGroup, Toggle } from 'rsuite';
import 'rsuite/Toggle/styles/index.css';
import { GANTTCHART_TYPE, REVIEW_INTERVAL_DAYS } from '@/Constants/Const';
import { generateTasks } from '@/Types/Task';
import axios from 'axios';
import { ClipLoader, FadeLoader } from 'react-spinners';
import SearchIcon from '@rsuite/icons/Search';

export default function Show(props) {
    const [isCreateProjectModalFlg, setIsCreateProjectModalFlg] = useState(false);
    const [isChartModalFlg, setIsChartModalFlg] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    let tables = [];

    const createTaskArr = (table, index) => {
        let project = '';
        let dependencies = null;
        let hideChildren = null;
        if (table.type == GANTTCHART_TYPE.TASK && table.project != '' && table.parent_task_id !== null) {
            project = table.project_uuid;
            // 復習機能をつけるときに実装
            dependencies = [props.tables[index - 1].uuid];
        } else if (table.type == GANTTCHART_TYPE.PROJECT) {
            hideChildren = table.hide_children;
        }
        let data = generateTasks({
            id: table.uuid,
            uuid: table.uuid,
            name: table.name,
            program_id: table.program_id,
            type: table.type,
            start: new Date(table.start),
            end: new Date(table.end),
            order: table.display_order,
            isDisabled: false,
            progress: table.progress,
            dependencies: dependencies,
            hideChildren: hideChildren,
            project: table.project_uuid,
            [table.type + 'Id']: table.id,
        });
        // let data = {
        //     id: table.uuid,
        //     uuid: table.uuid,
        //     name: table.name,
        //     program_id: table.program_id,
        //     type: table.type,
        //     start: new Date(table.start),
        //     end: new Date(table.end),
        //     order: table.display_order,
        //     isDisabled: false,
        //     progress: table.progress,
        // };
        // if (table.type == 'task' && table.project != '') {
        //     data['project'] = table.project_uuid;
        //     // 復習機能をつけるときに実装
        //     data['dependencies'] = [props.tables[index - 1].uuid];
        // } else if (table.type == 'project') {
        //     data['hideChildren'] = table.hide_children;
        // }
        return data;
    }
    const parseTaskData = () => {
        tables = props.tables.map((table, index) => {
            let data = createTaskArr(table, index);
            return data;
        });
        return tables;
    }

    const [masterData, setMasterData] = useState(parseTaskData());
    const { data, setData, post, delete: destroy } = useForm({
        tables: masterData,
        program: props.program
    });

    const updateTask = (task, postData) => {
        setIsSaving(true);
        axios.post(
            route('api.gantt.chart.program.project.task.update',
                {
                    programUuid: props.program.uuid,
                    projectUuid: task.project,
                    taskUuid: task.uuid
                }
            ),
            postData
        ).then(response => {
            console.log(response);
            setIsSaving(false);
        }).catch(error => {
            console.log(error);
            setIsSaving(false);
        })
    }

    const handleExpanderClick = (row) => {
        setData('tables', data.map(t => (t.id === row.id ? row : t)));
        console.log("On expander click Id:" + row.id);
    };

    const getStartEndDateForProject = (tasks, projectId) => {
        const projectTasks = tasks.filter((t) => t.project === projectId);
        let start = projectTasks[0].start;
        let end = projectTasks[0].end;
        for (let i = 0; i < projectTasks.length; i++) {
            const task = projectTasks[i];
            if (start.getTime() > task.start.getTime()) {
                start = task.start;
            }
            if (end.getTime() < task.end.getTime()) {
                end = task.end;
            }
        }
        return [start, end];
    }

    /**
     * @param {Date} date
     * @param {boolean} isEnd
     * @returns
     */
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const setStartTime = (startDate) => {
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        return startDate;
    }

    const setEndTime = (endDate) => {
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);
        return endDate;
    }
    const handleTaskChange = (task) => {
        console.log("On date change Id:" + task.id);
        const startTime = setStartTime(task.start);
        const endTime = setEndTime(task.end);
        let newTasks = data.tables.map((t) => {
            if (t.id === task.id) {
                t.start = startTime;
                t.end = endTime;
            }
            return t;
        });
        if (task.project && searchValue === '') {
            const [start, end] = getStartEndDateForProject(newTasks, task.project);
            const project =
                newTasks[newTasks.findIndex((t) => t.id === task.project)];
            if (
                project.start.getTime() !== start.getTime() ||
                project.end.getTime() !== end.getTime()
            ) {
                const changedProject = { ...project, start, end };
                newTasks = newTasks.map((t) =>
                    t.id === task.project ? changedProject : t
                );
            }
        }
        setData('tables', newTasks);

        updateTask(task, { start: formatDate(startTime), end: formatDate(endTime) })
    };

    const handleCheckedReview = (value) => {
        setData('program', { ...data.program, isReview: value });
    }

    const tableComponent = () => {
        return (
            <TaskListTable
                data={data}
                setData={setData}
                destroy={destroy}
                updateTask={updateTask}
                setIsSaving={setIsSaving}
                programUuid={props.program.uuid}
                // updateMasterData={updateMasterData}
            />
        );
    }

    const styles = {
        width: 300,
        marginLeft: 10
    };

    const searchTask = () => {
        if (searchValue === '') {
            setData('tables', masterData);
            return;
        }
        setData('tables', masterData.filter(data => data.name.includes(searchValue)));
    }

    return (
        <>
            <AuthenticatedLayout
                user={props.auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gantt Chart</h2>}
            >
                <Head title="Gantt Chart" />

                {/* グラフコンポーネントの呼び出し */}
                <div className="component-main">
                    <div className='flex justify-between mb-4 items-center'>
                        <div className='flex items-center'>
                            <span className='inline-block align-middle'>{props.program.name}</span>
                            <Toggle
                                checked={data.program.is_review == true}
                                onChange={handleCheckedReview}
                                className='pl-3'
                                readOnly
                            />
                            <span className='pl-1'>Review</span>
                            <InputGroup size="md" style={styles}>
                                <Input
                                    placeholder={'Search Project & Task'}
                                    defaultValue={searchValue}
                                    onChange={(val) => {
                                        setSearchValue(val)
                                    }}
                                />
                                {/* <InputGroup.Button tabIndex={-1} > */}
                                <InputGroup.Button tabIndex={-1} onClick={(e) => searchTask()}>
                                    <SearchIcon />
                                </InputGroup.Button>
                            </InputGroup>
                            {
                                isSaving == true ?
                                    <div className='flex ml-4'>
                                        <span>Saving...</span>
                                        <ClipLoader size={24} color="#36d7b7" className='ml-4' />
                                    </div>
                                : ''
                            }
                        </div>
                        <div className='flex'>
                            <button className='flex rounded-lg bg-indigo-600 aline-middle h-full px-2' onClick={(e) => setIsCreateProjectModalFlg(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" className='mx-0 my-auto' fill='white'>
                                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                </svg>
                                <span className='p-2 text-white'>New Program</span>
                            </button>
                            <button className='flex rounded-lg bg-indigo-600 aline-middle h-full px-2 ml-2' onClick={(e) => setIsChartModalFlg(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" className='mx-0 my-auto' fill='white'>
                                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                </svg>
                                <span className='p-2 text-white'>New Chart</span>
                            </button>
                        </div>
                    </div>
                    {
                        data.tables.length > 0 ?
                            <Gantt
                                TaskListTable={tableComponent}
                                tasks={data.tables}
                                viewMode={"Day"}
                                listCellWidth={"155px"}
                                columnWidth={50}
                                barBackgroundColor="blue"
                                rowHeight={40}
                                fontSize={9}
                                onDateChange={handleTaskChange}
                                locale={"en"}
                                onExpanderClick={handleExpanderClick}
                                // onDateChange={() => }
                                // onTaskDelete={onTaskDelete}
                                onProgressChange={(e) => console.log(e)}
                                // onDoubleClick={onDblClick}
                                // onClick={handleTaskChange}
                                TaskListHeader={TaskListHeader}
                            />
                            :
                            <div className='p-5 w-full text-center h-full'>
                                <h3>Create a Gantt Chart</h3>
                            </div>
                    }
                </div>
            </AuthenticatedLayout>

            <CreateProgramModal
                isModalFlg={isCreateProjectModalFlg}
                setIsModalFlg={setIsCreateProjectModalFlg}
            />

            <CreateTaskModal
                isModalFlg={isChartModalFlg}
                setIsModalFlg={setIsChartModalFlg}
                programUuid={props.program.uuid}
            />
        </>
    );
}