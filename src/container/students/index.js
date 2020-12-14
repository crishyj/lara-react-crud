import React, {Component} from 'react';
import {Table, Button} from 'reactstrap';
import axios from "axios";
import AddStudent from './addStudents';
import EditStudent from './editStudent';

export default class Student extends Component{

    constructor(props){
        super(props);
        this.state = {
            students: [],
            newStudentData: {
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
            },
            isLoading: false,
            status: '',
            newStudentModal: false,
            editStudentData: {
                id: '',
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
            },
            editStudentModal: false,
            noDataFound: '',
        }
    }

    componentDidMount(){
        this.getStudents(); 
    }

    getStudents(){
        axios.get("http://crud-api.com/api/student").then((response) => {
            if(response.status === 200){
                this.setState({
                    students: response.data.data ? response.data.data : [],
                });
            }

            if(response.data.status === 'failed' && response.data.success === false)
            {
                this.setState({
                    noDataFound: response.data.message,
                });
            }
        });
    }
    
    toggleNewStudentModal = () => {
        this.setState({
            newStudentModal: !this.state.newStudentModal,
        });
    };

    onChangeAddStudentHandler = (e) => {
        let {newStudentData} = this.state;
        newStudentData[e.target.name] = e.target.value;
        this.setState({ newStudentData });
    };

    addStudent = () => {
        axios.post("http://crud-api.com/api/createStudent", this.state.newStudentData)
        .then((response) => {
            const { students } = this.state;
            const newStudents = [...students];
            newStudents.push(response.data);
            this.setState(
              {
                students: newStudents,
                newStudentModal: false,
                newStudentData: {
                  first_name: "",
                  last_name: "",
                  email: "",
                  phone: "",
                },
              },
              () => this.getStudents()
            );
        });
    };

    toggleEditStudentModal = () => {
        this.setState({
            editStudentModal: !this.state.editStudentModal,
        });
    };

    onChangeEditStudentHandler = (e) =>{
        let { editStudentData } = this.state;
        editStudentData[e.target.name] = e.target.value;
        this.setState( { editStudentData } );
    };

    editStudent = (id, first_name, last_name, email, phone) => {
        this.setState({
            editStudentData: {id, first_name, last_name, email, phone},
            editStudentModal: !this.state.editStudentModal,
        });
    };

    updateStudent = () => {
        let{
            id,
            first_name,
            last_name,
            email,
            phone,
        } = this.state.editStudentData;

        this.setState({
            isLoading: true,
        });

        axios.post('http://crud-api.com/api/createStudent', {
            id,
            first_name,
            last_name,
            email,
            phone,            
        }).then((response) => {
            this.getStudents();
            this.setState({
                editStudentModal: false,
                editStudentData: { first_name, last_name, email, phone },
                isLoading: false,
            });
        }).catch((error) => {
            this.setState({isLoading: false})
            console.log(error.response);
        });
    };

    deleteStudent = (id) => {
        this.setState({
            isLoading: true,
        });
        axios
        .delete('http://crud-api.com/api/student/' + id)
        .then((response) => {
            this.setState({
                isLoading: false,
            });
            this.getStudents();
        }).catch((error) => {
            this.setState({
                isLoading: false,
            });
        });
    };

    render(){
        const { newStudentData, editStudentData, noDataFound, students } = this.state;
        let studentsDetails = [];
        if(students.length){
            studentsDetails = students.map((student) => {
                return (
                    <tr key = {student.id}>
                        <td> {student.id} </td>
                        <td> {student.first_name} </td>
                        <td> {student.last_name} </td>
                        <td> {student.full_name} </td>
                        <td> {student.email} </td>
                        <td> {student.phone} </td>
                        <td>
                            <Button 
                                className='mr-3' 
                                color='success' 
                                size='sm'
                                onClick = { () => 
                                    this.editStudent(
                                        student.id,
                                        student.first_name,
                                        student.last_name,
                                        student.email,
                                        student.phone
                                    )
                                }
                            >
                                Edit
                            </Button>

                            <Button 
                                color='danger' 
                                size='sm'
                                onClick = { () => this.deleteStudent(student.id)}
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                );
            })
        }
        if(this.state.isLoading){
            return <div className='spinner-border text-center' role='status'>
                <span className="sr-only">
                    Loading...
                </span>
            </div>
        }
        return (
            <div className="App container mt-4">
                <h4 className="font-weight-bold">
                    Students Registration
                </h4>

                <AddStudent 
                    toggleNewStudentModal = {this.toggleNewStudentModal}
                    newStudentModal = {this.state.newStudentModal}
                    onChangeAddStudentHandler = {this.onChangeAddStudentHandler}
                    addStudent = {this.addStudent}
                    newStudentData  = {newStudentData}
                />

                <EditStudent
                    toggleEditStudentModal = {this.toggleEditStudentModal}
                    editStudentModal = {this.state.editStudentModal}
                    onChangeEditStudentHandler = {this.onChangeEditStudentHandler}
                    editStudent = {this.editStudent}
                    editStudentData = {editStudentData}
                    updateStudent = {this.updateStudent}
                />

                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {students.length === 0 ? (
                        <tbody>
                            <tr>
                                {noDataFound}
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {studentsDetails}
                        </tbody>
                    )}
                </Table>

            </div>
        );
    }
}