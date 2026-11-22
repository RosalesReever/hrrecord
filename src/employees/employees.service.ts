import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity.js';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(data: Partial<Employee>) {
    const employee = this.employeeRepository.create(data);
    return await this.employeeRepository.save(employee);
  }

  async findAll() {
    return await this.employeeRepository.find();
  }

  async findOne(id: number) {
    const employee = await this.employeeRepository.findOneBy({ id });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(id: number, data: Partial<Employee>) {
    const employee = await this.findOne(id);
    Object.assign(employee, data);
    return await this.employeeRepository.save(employee);
  }

  async remove(id: number) {
    const employee = await this.findOne(id);
    return await this.employeeRepository.remove(employee);
  }
}
