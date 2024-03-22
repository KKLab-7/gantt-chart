import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head, useForm } from '@inertiajs/react';
import { StrictMode, useState } from 'react';
import "gantt-task-react/dist/index.css";
import TaskListTable from './Partials/TaskListTable';
import CreateProgramModal from './Partials/CreateProgramModal';
import Table from '@/Components/Table/Table';
import Thead from '@/Components/Table/Thead';
import Tbody from '@/Components/Table/Tbody';
import TbodyTr from '@/Components/Table/TbodyTr';
import Td from '@/Components/Table/Td';
import CreateTaskModal from './Partials/CreateTaskModal';
import DropdownMenu from '@/Components/Table/DropdownMenu';
import DeleteComfirmModal from './Partials/DeleteComfirmModal';

export default function Index(props) {
    const [isCreateProgramModalFlg, setIsCreateProgramModalFlg] = useState(false);
    const [isDeleteProgramModalFlg, setIsDeleteProgramModalFlg] = useState(false);
    const [deleteProgramData, setDeleteProgramData] = useState(false);
    const { data, setData, delete: destroy } = useForm({
        programs: props.programs
    });
    const tableHeadItems = [
        'Program',
        'Progress',
        'Start Day',
        'End Day',
        'Action',
    ];

    const deleteProgram = (programUuid) => {
        destroy(route('gantt.chart.program.delete',
            {
                programUuid: programUuid,
            }),
            {
                onSuccess: (e) => {
                    setData('programs', e.props.programs);
                    setIsDeleteProgramModalFlg(false);
                },
                onError: (e) => {
                    console.log(e);
                }
            }
        )
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
                    <div className='flex justify-between'>
                        <span className='aline-bottom'>Project Gantt Chart</span>
                        <div className='flex'>
                            <button className='flex rounded-lg bg-indigo-600 aline-middle h-full px-2' onClick={(e) => setIsCreateProgramModalFlg(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" className='mx-0 my-auto' fill='white'>
                                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                </svg>
                                <span className='p-2 text-white'>New Program</span>
                            </button>
                        </div>
                    </div>
                    {
                        // data.tables.length > 0 ?
                        data.programs.length > 0 ?
                            <Table>
                                <Thead
                                    items={tableHeadItems}
                                />
                                <Tbody>
                                    {data.programs.map((program, key) => {
                                    return(
                                        <TbodyTr key={key} >
                                            <Td key={'td-' + key}>
                                                {program.name}
                                            </Td>
                                            <Td>
                                                {program.progress}%
                                            </Td>
                                            <Td>
                                                {program.start}
                                            </Td>
                                            <Td>
                                                {program.end}
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
                                                            Show Program
                                                        </DropdownMenu.Link>
                                                        <DropdownMenu.Link
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setDeleteProgramData(program);
                                                                setIsDeleteProgramModalFlg(true);
                                                            }}
                                                        >
                                                            Delete Program
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

            <CreateProgramModal
                isModalFlg={isCreateProgramModalFlg}
                setIsModalFlg={setIsCreateProgramModalFlg}
            />

            <DeleteComfirmModal
                isModalFlg={isDeleteProgramModalFlg}
                setIsModalFlg={setIsDeleteProgramModalFlg}
                deleteProgramData={deleteProgramData}
                deleteProgram={deleteProgram}
            />
        </>
    );
}