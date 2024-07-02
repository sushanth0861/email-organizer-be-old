import { prisma } from "../lib/db";

export const updateMailCategory = async (
  user_id: string,
  mail_id: string,
  from: string,
  to: string
) => {
  const category = await prisma.category.findFirst({
    where: { user_id },
  });

  if (!category) {
    throw new Error("User not found or no categories available.");
  }

  if (!category[from].includes(mail_id)) {
    throw new Error(`Mail is not in the ${from} category.`);
  }

  // Remove from the 'from' category
  category[from] = category[from].filter((id) => id !== mail_id);
  // Add to the 'to' category
  category[to].push(mail_id);

  await prisma.category.update({
    where: { id: category.id },
    data: {
      [from]: category[from],
      [to]: category[to],
    },
  });

  return { message: `Mail moved to ${to} successfully` };
};
