import customerRepository from '../repositories/index.js';
import type { CustomerCsvRow } from '../schemas/customers.schema.js';

export const customerUploadService = {
    async processCustomerCsv(customers: CustomerCsvRow[], companyId: number) {
        const results = {
            created: 0,
            updated: 0,
            failed: 0,
            errors: [] as { data: CustomerCsvRow; error: any }[],
        };

        for (const customerData of customers) {
            try {
                let existingCustomer;
                if (customerData.이메일) {
                    existingCustomer = await customerRepository.findByEmail(customerData.이메일);
                } else if (customerData.연락처) {
                    existingCustomer = await customerRepository.findByPhoneNumber(customerData.연락처);
                }
            
                if (existingCustomer) {
                    // 기존 고객이 있으면 업데이트
                    await customerRepository.updateFromCsv(existingCustomer.id, customerData);
                    results.updated++;
                } else {
                    // 새 고객 생성
                    await customerRepository.createFromCsv(customerData, companyId);
                    results.created++;
                }
            } catch (error: any) {
                results.failed++;
                results.errors.push({ data: customerData, error: error.message });
            }
        }
          
        return results;
    },
};
