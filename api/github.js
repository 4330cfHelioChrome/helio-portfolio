export default async function handler(req, res) {
    const token = process.env.GITHUB_TOKEN;
    const username = "HelioChrome"; // 본인 깃허브 아이디

    if (!token) {
        return res.status(500).json({ error: "GitHub token is not configured" });
    }

    const query = `
        query($username: String!) {
            user(login: $username) {
                repositories(privacy: PUBLIC) {
                    totalCount
                }
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                    }
                }
                pullRequests {
                    totalCount
                }
                issues {
                    totalCount
                }
                starredRepositories {
                    totalCount
                }
            }
        }
    `;

    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables: { username } })
        });

        const data = await response.json();
        
        if (data.errors) {
            return res.status(400).json({ error: data.errors[0].message });
        }

        const user = data.user;
        return res.status(200).json({
            totalRepos: user.repositories.totalCount,
            totalCommits: user.contributionsCollection.contributionCalendar.totalContributions,
            totalPRs: user.pullRequests.totalCount,
            totalIssues: user.issues.totalCount,
            totalStars: user.starredRepositories.totalCount
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
