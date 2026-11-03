import paths from '../../server/paths'

const config = {
  moduleName: 'cpb-team-filter',
  fallbackProviderFormId: 'filter-provider-no-js',
  teamRowId: 'filter-team-row',
  jsTemplateId: 'filter-provider-team-js',
  providerInputId: 'provider',
  teamInputId: 'team',
  defaultTeamOption: { value: '', text: 'Choose a region' },
  redirectUrl: '/',
}

export default function initTeamFilter() {
  document.addEventListener('DOMContentLoaded', initFilterModule)
}

async function initFilterModule() {
  const module = document.querySelector(`[data-module="${config.moduleName}"]`)
  if (!module) {
    return
  }

  const providerForm = document.getElementById(config.fallbackProviderFormId)

  if (providerForm) {
    config.redirectUrl = providerForm.getAttribute('action') || config.redirectUrl
    replaceProviderForm(providerForm)

    const providerSelect = document.getElementById(config.providerInputId)

    providerSelect.addEventListener('change', async () => changeTeams(providerSelect))
  }

  const teamSelect = document.getElementById(config.teamInputId)

  if (teamSelect) {
    teamSelect.addEventListener('change', () => updateSearchPath(teamSelect))
    updateSearchPath(teamSelect)
  }
}

function updateSearchPath(teamSelect) {
  const { form } = teamSelect

  if (teamSelect.value === '' || !form) {
    return
  }

  form.action = paths.sessions.search({})
}

async function changeTeams(providerSelect) {
  const teamSelect = document.getElementById(config.teamInputId)
  const providerCode = providerSelect.options[providerSelect.selectedIndex].value

  if (providerCode !== '') {
    await populateTeamsForRegion(providerCode, teamSelect)
  } else {
    teamSelect.setAttribute('disabled', 'disabled')
    const defaultOption = buildOption(config.defaultTeamOption)
    teamSelect.replaceChildren(defaultOption)
  }
}

async function populateTeamsForRegion(providerCode, teamSelect) {
  await fetch(paths.data.teams({ provider: providerCode }))
    .then(async result => {
      if (result.status === 401) {
        window.location.href = config.redirectUrl
        return null
      }

      if (!result.ok) {
        return handleError()
      }

      const { teams } = await result.json()
      return teams
    })
    .then(teams => {
      if (teams) {
        teamSelect.removeAttribute('disabled')
        const teamItems = teams.map(buildOption)
        teamSelect.replaceChildren(...teamItems)
      }
    })
    .catch(_ => handleError())
}

function handleError() {
  window.location.href = paths.error.pattern
  return null
}

function buildOption(item) {
  const option = document.createElement('option')
  option.value = item.value
  option.text = item.text
  return option
}

function replaceProviderForm(fallbackProviderSelect) {
  const fallbackTeamSelect = document.getElementById(config.teamRowId)
  const template = document.getElementById(config.jsTemplateId)
  const clone = document.importNode(template.content, true)
  fallbackProviderSelect.parentElement.removeChild(fallbackProviderSelect)
  fallbackTeamSelect.replaceChildren(clone)
}
