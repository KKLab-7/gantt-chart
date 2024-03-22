import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { DateRangePicker, Radio, RadioGroup, Stack } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import 'rsuite/Radio/styles/index.css';
import 'rsuite/RadioGroup/styles/index.css';
import '../../../../css/styles.css';
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputError from "@/Components/InputError";
import Select from "react-select";
import axios from "axios";
import { useEffect } from "react";
import { GANTTCHART_TYPE } from "@/Constants/Const";

export default function CreateTaskModal({ isModalFlg, setIsModalFlg, programUuid }) {
    const [projectList, setProjectList] = useState([]);
    useEffect(() => {
        /** Get a list of projects associated with a program. */
        axios.get(route('api.gantt.chart.program.list', { programUuid: programUuid }))
            .then((response) => {
                setProjectList(response.data.map(row => {
                    console.log(row);
                    return {
                        value: row.name,
                        label: row.name,
                        id: row.id,
                        uuid: row.uuid
                    }
                }));
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);
    const allowedCharacters = /^[0-9a-zA-Z!#$%&?¥~()=-\s]+$/;
    const { data, setData, post, errors, setError, clearErrors } = useForm({
        chartType: GANTTCHART_TYPE.PROJECT,
        project: '',
        projectUuid: '',
        task: '',
        date: {
            startDate: new Date(),
            endDate: null,
            key: 'selection',
        },
    });

    const chartType = [
        { label: 'Project', value: GANTTCHART_TYPE.PROJECT },
        { label: 'Task', value: GANTTCHART_TYPE.TASK },
    ];

    const handleChange = (column, value) => {
        setData(column, value);
    }

    const handleDateChange = (value) => {
        setData(data => ({
                ...data, date:
                {
                    startDate: value[0],
                    endDate: value[1],
                }
            }
        ));
    };

    const validation = () => {
        let isError = false;
        clearErrors();
        if (data.chartType == GANTTCHART_TYPE.PROJECT) {
            if (data.project === '' ) {
                setError('project', 'Please enter the Project.');
                isError = true;
            } else if (allowedCharacters.test(data.project) === false) {
                setError('project', 'Input contains disallowed characters.');
                isError = true;
            }
        } else if (data.projectUuid === '' && data.chartType == GANTTCHART_TYPE.TASK) {
            setError('project', 'Please select the Project.');
            isError = true;
        }

        if (data.task === '') {
            setError('task', 'Please enter the Task.');
            isError = true;
        } else if (allowedCharacters.test(data.task) === false) {
            setError('task', 'Input contains disallowed characters.');
            isError = true;
        }

        if (data.date.startDate == null || data.date.endDate == null) {
            setError('date', 'Please enter the Task Period.');
            isError = true;
        }

        if (isError === false) {
            createProgram();
        }
    }

    const createProgram = () => {
        post(route('gantt.chart.program.create', { programUuid: programUuid }),  {
            onSuccess: (e) => {
                console.log(e);
                setIsModalFlg(false);
            },
            onError: (e) => {
                console.log(e);
            }
        })
    }

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            height: '42px',
        }),
    };

    return(
        <Modal show={isModalFlg} onClose={(e) => setIsModalFlg(false)}>
            <div className='flex justify-between border-b p-4'>
                <span>Create Chart</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height={24} width={24} onClick={(e) => setIsModalFlg(false)}>
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
            </div>
            <div className='p-4'>
                <div className='pb-2'>
                    <RadioGroup
                        name={'radioList'}
                        defaultValue={data.chartType}
                    >
                        <span>Chart Type</span>
                        <div className="component-input-radio-parant">
                            {
                                chartType.map(item => {
                                    return (
                                        <Radio
                                            key={item.label}
                                            value={item.value}
                                            onChange={(value) => setData('chartType', value)}
                                        >
                                            { item.label }
                                        </Radio>
                                    );
                                })
                            }
                        </div>
                    </RadioGroup>
                </div>
                <div className='pb-2'>
                    {
                        data.chartType == 'project' ? 
                            <>
                                <InputLabel
                                    forInput={'project'}
                                >
                                    Project Name
                                </InputLabel>
                                <TextInput
                                    className={'w-1/2'}
                                    name={'project_name'}
                                    id={'project_name'}
                                    onChange={(e) => handleChange('project', e.target.value)}
                                />
                            </>
                        : 
                            <>
                                <InputLabel
                                >
                                    Project
                                </InputLabel>
                                <Select
                                    styles={customStyles}
                                    id={'parent_project'}
                                    name={'parent_project'}
                                    options={projectList}
                                    className={'w-1/2'}
                                    defaultValue={projectList.filter(option => option.uuid === data.projectUuid)}
                                    onChange={(e) => setData('projectUuid', e.uuid)}
                                />
                            </>

                    }
                    <InputError className="mt-2" message={errors.project}/>
                </div>
                <div className='pb-2'>
                    <InputLabel
                        forInput={'project_name'}
                    >
                        Task Name
                    </InputLabel>
                    <TextInput
                        className={'w-1/2'}
                        name={'project_name'}
                        id={'project_name'}
                        onChange={(e) => handleChange('task', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.task} />
                </div>
                <div className='pb-2'>
                    <div>Task Period</div>
                    <Stack spacing={10} direction="column" alignItems="flex-start">
                        <DateRangePicker
                            format="MM/dd/yyyy"
                            character=" – "
                            style={{ zIndex: 51 }}
                            name="date_range"
                            onChange={handleDateChange}
                        />
                    </Stack>
                    <InputError className="mt-2" message={errors.date} />
                </div>
            </div>
            <div className='flex justify-end border-t p-4 '>
                <SecondaryButton
                    onClick={(e) => setIsModalFlg(false)}
                    className="mr-2"
                >
                    Cansell
                </SecondaryButton>
                <PrimaryButton
                    onClick={(e) => validation()}
                >
                    Create
                </PrimaryButton>
            </div>
        </Modal>
    );
}