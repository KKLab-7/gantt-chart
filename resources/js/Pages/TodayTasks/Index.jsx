import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head, useForm } from '@inertiajs/react';
import { StrictMode, useState } from 'react';
import "gantt-task-react/dist/index.css";
import Table from '@/Components/Table/Table';
import Thead from '@/Components/Table/Thead';
import Tbody from '@/Components/Table/Tbody';
import TbodyTr from '@/Components/Table/TbodyTr';
import Td from '@/Components/Table/Td';
import DropdownMenu from '@/Components/Table/DropdownMenu';
import Select from "react-select";
import { progressOptions } from '@/Constants/OptionsConsts';
import { customStyles } from '@/Constants/Styles';
import runnerImage from '../../../../public/images/runner.png';
import { ClipLoader } from 'react-spinners';

export default function Index(props) {
    const tableHeadItems = [
        'task',
        'program',
        'project',
        'progress',
        'start day',
        'end day',
        'actions',
    ];

    const [isSaving, setIsSaving] = useState(false);
    const [todayProgress, setTodayProgress] = useState(props.progress);
    const { data, setData } = useForm({
        tables: props.todayTasks,
    });

    const onChangeTaskProgress = (value, task) => {
        let totalProgress = 0;
        let totalTime = 0;

        setData('tables', data.tables.map(t => {
            if (t.uuid === task.uuid) {
                t.progress = value;
            }

            // calculate project progress
            const diffTime = new Date(t.end).getTime() - new Date(t.start).getTime();
            totalProgress += Number(t.progress * diffTime);
            totalTime += Number(diffTime);
            return t;
        }));
        console.log(Math.round(totalProgress / totalTime));
        setTodayProgress(Math.round(totalProgress / totalTime));

        // updateMasterData(task);
        updateTask(task, { progress: value });
    };

    const updateTask = (task, postData) => {
        setIsSaving(true);
        axios.post(
            route('api.gantt.chart.program.project.task.update',
                {
                    programUuid: task.programUuid,
                    projectUuid: task.projectUuid,
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
    return (
        <>
            <AuthenticatedLayout
                user={props.auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gantt Chart</h2>}
            >
                <Head title="Gantt Chart" />

                {/* グラフコンポーネントの呼び出し */}
                <div className="component-main">
                    <div className='flex h-8'>
                        <span className='aline-bottom'>Today Task</span>
                        <div className='progress-parent'>
                            <div style={{ width: `${todayProgress}%` }} className={'progress-child ' + (todayProgress < 100 ? 'processing' : 'processed')} />
                            <img src={runnerImage} className='progress-image' style={{ left: `${todayProgress}%` }} />
                        </div>
                        <span className='progress-text'>{todayProgress}%</span>
                        {
                            isSaving == true ?
                                <div className='flex ml-4'>
                                    <span>Saving...</span>
                                    <ClipLoader size={24} color="#36d7b7" className='ml-4' />
                                </div>
                                : ''
                        }
                    </div>
                    {
                        // data.tables.length > 0 ?
                        data.tables.length > 0 ?
                            <Table>
                                <Thead
                                    items={tableHeadItems}
                                />
                                <Tbody>
                                    {data.tables.map((task, key) => {
                                        return (
                                            <TbodyTr key={key} >
                                                <Td key={'td-' + key}>
                                                    {task.name}
                                                </Td>
                                                <Td>
                                                    {task.project}
                                                </Td>
                                                <Td>
                                                    {task.program}
                                                </Td>
                                                <Td>
                                                    <Select
                                                        name={'task_progress_' + task.id}
                                                        options={progressOptions}
                                                        styles={customStyles}
                                                        defaultValue={progressOptions.filter(option => option.value == task.progress)}
                                                        onChange={(e) => onChangeTaskProgress(e.value, task)}
                                                    />
                                                </Td>
                                                <Td>
                                                    {task.start}
                                                </Td>
                                                <Td>
                                                    {task.end}
                                                </Td>
                                                <Td>
                                                    <DropdownMenu>
                                                        <DropdownMenu.Content>
                                                            <DropdownMenu.Link
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    window.location.href = route('gantt.chart.program.show', program.uuid)
                                                                }}
                                                            >
                                                                Show task
                                                            </DropdownMenu.Link>
                                                            <DropdownMenu.Link
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setDeleteProgramData(task);
                                                                    setIsDeleteProgramModalFlg(true);
                                                                }}
                                                            >
                                                                Delete task
                                                            </DropdownMenu.Link>
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu>
                                                </Td>
                                            </TbodyTr>
                                        );
                                    })}
                                </Tbody>
                            </Table>
                            :
                            <div className='p-5 w-full text-center h-full'>
                                <h3>Create a Gantt Chart</h3>
                            </div>
                    }
                </div>
            </AuthenticatedLayout>

        </>
    );
}