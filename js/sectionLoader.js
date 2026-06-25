async function renderSectionById(id, filePath) {
  const target = document.getElementById(id);

  if (!target) {
    console.error("Element with id \"" + id + "\" not found.");
    return;
  }

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error("Failed to load " + filePath + ": " + response.status);
    }

    const html = await response.text();
    target.innerHTML = html;
  } catch (error) {
    console.error("Error rendering section:", error);
  }
}

async function renderSections(sectionsConfig) {
  for (const section of sectionsConfig) {
    await renderSectionById(section.id, section.path);
  }
}
