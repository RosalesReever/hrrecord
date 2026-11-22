import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 20 })
  gender: string;

  @Column({ length: 100 })
  position: string;

  @Column({ length: 100 })
  department: string;

  @Column({ length: 20 })
  contactNumber: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'date' })
  dateHired: string;
}
