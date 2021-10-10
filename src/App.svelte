<script lang="ts">
	import { makeGame } from './lib/records'
	import { keyedCategories, keyedTeams, teamByPath, sortedQuestions, keyedQuestions, keyedPlayers } from "./lib/query";
	import { scoreForTeam, categoriesNeedingBonus, gameNeedsCategoryChoice, pathToCurrentQuestion } from './lib/rules'
	import { nextQuestion, scoreBonus, selectQuestion, scoreAnswer } from './lib/mutations'

	let game = makeGame()
	let history = []

	const update = (newGame) => {
		history.push(game)
		game = newGame
	}
	const undo = () => game = history.pop() || makeGame()

	$: currentQuestionPath = pathToCurrentQuestion(game)

	const next = () => update(nextQuestion(game))
	const score = (category, team, score) => update(scoreBonus(game, category, team, score))
	const select = (questionPath) => update(selectQuestion(game, questionPath))
	const answer = (questionPath, playerPath, isCorrect) => update(scoreAnswer(game, questionPath, playerPath, isCorrect))
</script>

<main>
	<button on:click={undo}>UNDO</button>

	{#each categoriesNeedingBonus(game).toArray() as [cKey, category] }
		{#each keyedTeams(game).toArray() as [tKey, team]}
			<p>
				Bonus for {team.name}:
				{#each [0, 5, 10, 15, 20] as points}
					<button on:click={() => score(cKey, tKey, points)}>{points}</button>
				{/each}
			</p>
		{/each}
	{/each}

	{#if gameNeedsCategoryChoice(game)}
		{#each keyedCategories(game).toArray() as [cKey, category]}
			<p>
				{category.name}:
				{#each keyedQuestions(game, cKey).toArray() as [qKey, question]}
					<button on:click={() => select(qKey)} disabled={question.number}>{question.value}</button>
				{/each}
			</p>
		{/each}
	{/if}

	{#if currentQuestionPath}
		{#each keyedTeams(game).toArray() as [tKey, team]}
			<p>
				{#each keyedPlayers(game, tKey).toArray() as [pKey, player]}
					<button on:click={() => answer(currentQuestionPath, pKey, true)}>{player.name} YES</button>
					<button on:click={() => answer(currentQuestionPath, pKey, false)}>{player.name} NO</button>
				{/each}
			</p>
		{/each}
	{/if}

	{#each keyedTeams(game).toArray() as [tKey, team]}
		<p>{teamByPath(game, tKey).name} Score: {scoreForTeam(game, tKey)}</p>
	{/each}

	<p>Currently on question {game.questionNumber} <button on:click={next}>NEXT!</button></p>

	{#each sortedQuestions(game).toArray() as [qKey, question]}
		<p>{question.number}: {question.value}</p>
	{/each}
</main>

<style>
	body {}
</style>