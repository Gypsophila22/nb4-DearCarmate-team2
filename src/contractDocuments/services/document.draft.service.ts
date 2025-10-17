import { documentDraftsRepository } from '../repositories/document.draft.repository.js';

type Actor = { id: number; companyId: number; isAdmin?: boolean };

export async function getDocumentDraftsService(actor: Actor) {
  const contracts = await documentDraftsRepository.findDraftableContracts(
    actor.companyId
  );

  const items = contracts.map((c) => {
    const modelName = c.car?.carModel?.model ?? c.car?.carNumber ?? '차량';
    const customerName = c.customer?.name ?? '고객';
    return { id: c.id, data: `${modelName} - ${customerName} 고객님` };
  });

  return items;
}
