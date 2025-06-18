import express from "express"
import dataSource from "../db/data-source";
import { Person } from "../entities/person.entity";
import PersonRepository from "../repositories/person.repository";
import PersonService from "../services/person.service";
import PersonController from "../controllers/person.controler";


export const personRouter = express.Router();
const personRepository = new PersonRepository(dataSource.getRepository(Person));
const personService = new PersonService(personRepository);
const personController = new PersonController(personService,personRouter);
export {personService};