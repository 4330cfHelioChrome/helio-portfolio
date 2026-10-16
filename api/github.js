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

        const result = await response.json();
        
        if (result.errors) {
            return res.status(400).json({ error: result.errors[0].message });
        }

        // 수정 포인트: result.data.user로 올바르게 접근
        const user = result.data.user;
        
        if (!user) {
            return res.status(404).json({ error: "GitHub user not found" });
        }

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
