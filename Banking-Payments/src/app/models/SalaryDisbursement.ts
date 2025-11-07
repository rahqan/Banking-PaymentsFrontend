interface SalaryDisbursement{
    salaryDisbursementId:number;
    createdAt:Date;
    amount:number;
    employeeId:number;
    employees:{
        name:string,
        position:string,
        department:string,
        salary:number
    }
};

export default SalaryDisbursement;