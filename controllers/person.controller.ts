import { NextFunction, Request, Response, Router } from "express";
import PersonService from "../services/person.service";
import { UserRole } from "../entities/person.entity";

class PersonController {
    constructor(private personService:PersonService,router:Router){
        router.get("/",this.checkCandidateExistsByEmail.bind(this));
    }

    async checkCandidateExistsByEmail(req: Request, res: Response,next:NextFunction) {
        const  email  = req.body.email;
        if (!email|| !email.includes("@")) {
            return res.status(400).json({ message: "Invalid Email Address" });
        }
        try {
            const person = await this.personService.getPersonByEmail(email as string);
            if (person && person.role === UserRole.CANDIDATE) {
                return res.status(200).send(person);
            } 
        } catch (err) {
            next(err);
        }
    }
}

export default PersonController;