import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { DateRangePicker, Stack } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import '../../../../css/styles.css';
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputError from "@/Components/InputError";
import { Toggle } from 'rsuite';
import 'rsuite/Toggle/styles/index.css';
import CheckIcon from '@rsuite/icons/Check';
import CloseIcon from '@rsuite/icons/Close';
import { Tooltip, Whisper, IconButton } from 'rsuite';
import { Icon } from '@rsuite/icons';
import 'rsuite/Tooltip/styles/index.css';
import InformationIcon from "@/Components/Svgs/InformationIcon";
import 'rsuite/IconButton/styles/index.css';

export default function CreateProgramModal({ isModalFlg, setIsModalFlg }) {
    console.log(isModalFlg);
    const allowedCharacters = /^[0-9a-zA-Z!#$%&?¥~()=-\s]+$/;
    const { data, setData, post, errors, setError, clearErrors } = useForm({
        program: '',
        isReview: false,
        project: '',
        date: {
            startDate: new Date(),
            endDate: null,
            key: 'selection',
        },
    });

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
        if (data.program === '') {
            setError('program', 'Please enter the Program.');
            isError = true;
        } else if (allowedCharacters.test(data.program) === false) {
            setError('program', 'Input contains disallowed characters.');
            isError = true;
        }

        if (data.project === '') {
            setError('project', 'Please enter the Project.');
            isError = true;
        } else if (allowedCharacters.test(data.project) === false) {
            setError('project', 'Input contains disallowed characters.');
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
        post(route('gantt.chart.create'),  {
            onSuccess: () => {
                setIsModalFlg(false);
            },
            onError: (e) => {
                console.log(e);
            }
        })
    }

    const handleCheckedReview = (value) => {
        setData('isReview', value);
    }

    const tooltip = () => {
        return(
            <Tooltip>
                Review the task.
            </Tooltip>
        )
    };

    return(
        <Modal show={isModalFlg} onClose={(e) => setIsModalFlg(false)}>
            <div className='flex justify-between border-b p-4'>
                <span>Create Program</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height={24} width={24} onClick={(e) => setIsModalFlg(false)}>
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
            </div>
            <div className='p-4'>
                <div className='pb-2'>
                    <InputLabel
                        forInput={'program_name'}
                    >
                        Program Name
                    </InputLabel>
                    <TextInput
                        className={'w-1/2'}
                        name={'program_name'}
                        id={'forInput'}
                        onChange={(e) => handleChange('program', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.program}/>
                </div>
                <div className='pb-2 flex-none'>
                    <span className=''>Review</span>
                    <Whisper
                        placement="top"
                        controlId="control-id-context-menu"
                        trigger="hover"
                        speaker={tooltip()}
                    >
                        <IconButton
                            icon={<InformationIcon/>}
                            appearance="subtle"
                            className="!p-0"
                            circle
                        />
                    </Whisper>
                    <Toggle
                        checked={data.isReview}
                        onChange={handleCheckedReview}
                        className='pl-1'
                        checkedChildren={<CheckIcon />} unCheckedChildren={<CloseIcon />}
                    />
                </div>
                <div className='pb-2'>
                    <InputLabel
                        forInput={'project_name'}
                    >
                        Project Name
                    </InputLabel>
                    <TextInput
                        className={'w-1/2'}
                        name={'project_name'}
                        id={'project_name'}
                        onChange={(e) => handleChange('project', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.project} />
                </div>
                <div className='pb-2'>
                    <InputLabel
                        forInput={'project_name'}
                    >
                        Task Name
                    </InputLabel>
                    <TextInput
                        className={'w-1/2'}
                        name={'task_name'}
                        id={'task_name'}
                        onChange={(e) => handleChange('task', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.project} />
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