import { LeaseProps, LeaseStatus } from 'src/module/lease/domain/lease';

export const isRentOverDue = (lease: LeaseProps) => {
  if (lease.status === LeaseStatus.OPEN) {
    return false;
  }

  if (lease.monthsPaid > lease.finalLeaseLength) {
    return false;
  }

  const dateSigned = new Date(lease.dateSigned);

  dateSigned.setMonth(dateSigned.getMonth() + lease.monthsPaid);
  dateSigned.setDate(dateSigned.getDate() + lease.gracePeriod);

  return Date.now() > dateSigned.getTime();
};
